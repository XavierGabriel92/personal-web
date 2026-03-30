#!/usr/bin/env bun
/**
 * Pre-commit hook: checks if staged code changes require documentation updates.
 * If yes, Claude auto-generates the updated docs and stages them.
 * Never blocks the commit — exits 0 on any failure.
 */

import { existsSync } from "fs";
import path from "path";

const REPO_ROOT = path.resolve(import.meta.dir, "..");

// Extensions to check for documentation impact
const RELEVANT_EXTENSIONS = [".ts", ".tsx", ".css"];

// Patterns to exclude from the diff (generated files, lock files, etc.)
const EXCLUDE_PATTERNS = [
  /^src\/gen\//,
  /routeTree\.gen\.ts$/,
  /bun\.lock$/,
  /package-lock\.json$/,
  /\.d\.ts$/,
  /\.husky\//,
  /\.hooks\//,
];

const MAX_DIFF_BYTES = 50_000;

interface DocUpdateResponse {
  needs_update: boolean;
  change_summary: string;
  updates: Array<{
    file_path: string;
    content: string;
    reason: string;
  }>;
}

async function run(args: string[], cwd = REPO_ROOT): Promise<string> {
  const proc = Bun.spawn(args, { cwd, stdout: "pipe", stderr: "pipe" });
  await proc.exited;
  return new Response(proc.stdout).text();
}

async function runClaude(prompt: string): Promise<string> {
  const encoder = new TextEncoder();
  const proc = Bun.spawn(["claude", "--print", "--output-format", "text"], {
    cwd: REPO_ROOT,
    stdin: encoder.encode(prompt),
    stdout: "pipe",
    stderr: "pipe",
  });
  await proc.exited;
  if (proc.exitCode !== 0) {
    const err = await new Response(proc.stderr).text();
    throw new Error(`claude CLI error: ${err.trim()}`);
  }
  return new Response(proc.stdout).text();
}

function filterRelevantFiles(files: string[]): string[] {
  return files.filter((f) => {
    const hasExt = RELEVANT_EXTENSIONS.some((ext) => f.endsWith(ext));
    const isExcluded = EXCLUDE_PATTERNS.some((re) => re.test(f));
    return hasExt && !isExcluded;
  });
}

async function readAllDocs(): Promise<Record<string, string>> {
  const docs: Record<string, string> = {};

  // Read docs/*.md
  const docsDir = path.join(REPO_ROOT, "docs");
  if (existsSync(docsDir)) {
    const glob = new Bun.Glob("*.md");
    for await (const filename of glob.scan(docsDir)) {
      const content = await Bun.file(path.join(docsDir, filename)).text();
      docs[`docs/${filename}`] = content;
    }
  }

  // Read ARCHITECTURE.md at root
  const archPath = path.join(REPO_ROOT, "ARCHITECTURE.md");
  if (existsSync(archPath)) {
    docs["ARCHITECTURE.md"] = await Bun.file(archPath).text();
  }

  return docs;
}

function buildPrompt(diff: string, docs: Record<string, string>): string {
  const docListing = Object.entries(docs)
    .map(([p, c]) => `=== ${p} ===\n${c}`)
    .join("\n\n");

  return `You are a documentation maintainer for a React 19 + TypeScript frontend application (personal-web).

Tech stack:
- React 19, TypeScript, Vite, TanStack Router (file-based routing), TanStack Query
- Kubb for auto-generated API clients from OpenAPI (src/gen/)
- React Hook Form + Zod for forms, shadcn/ui + Tailwind CSS v4 for UI
- Better Auth for authentication, @hello-pangea/dnd for drag-and-drop
- Biome for linting/formatting, Vitest for testing

Documentation structure:
- ARCHITECTURE.md (root): high-level overview with links to all docs
- docs/PRODUCT.md: product overview, users, domain model
- docs/ROUTING.md: TanStack Router patterns
- docs/DATA_FETCHING.md: TanStack Query patterns
- docs/API_CLIENT.md: Kubb config and generated client usage
- docs/AUTHENTICATION.md: Better Auth setup and session
- docs/FORMS.md: React Hook Form + Zod patterns
- docs/UI_COMPONENTS.md: shadcn/ui components
- docs/STYLING.md: Tailwind CSS patterns
- docs/STATE_MANAGEMENT.md: state strategies
- docs/DRAG_DROP.md: drag and drop implementation
- docs/TESTING.md: testing setup and patterns
- docs/BUILD_DEVELOPMENT.md: dev workflow
- docs/BEST_PRACTICES.md: coding standards
- docs/CLIENT_ROUTINE.md: client/routine relationship
- docs/WHATSAPP_INVITE.md: Client email activation (legacy path)
- docs/backlog.md: future work

Rules:
- ONLY update docs when a NEW pattern is introduced or an existing pattern changes significantly
- SKIP: minor bug fixes, style tweaks, refactoring that doesn't change public APIs/patterns
- NEVER update docs/backlog.md based on code changes
- When updating, write the COMPLETE new file content (not a diff)
- Respond with ONLY a raw JSON object — no markdown fences, no explanation outside the JSON

## Staged Changes (git diff)

${diff}

## Current Documentation

${docListing}

## Task

Respond with this exact JSON schema:
{
  "needs_update": boolean,
  "change_summary": "one sentence describing what changed",
  "updates": [
    {
      "file_path": "docs/ROUTING.md",
      "content": "complete new file content here",
      "reason": "one sentence explaining why this doc needs updating"
    }
  ]
}`;
}

async function applyUpdates(updates: DocUpdateResponse["updates"]): Promise<void> {
  const staged: string[] = [];
  for (const u of updates) {
    const fullPath = path.join(REPO_ROOT, u.file_path);
    await Bun.write(fullPath, u.content);
    console.log(`  Updated: ${u.file_path} — ${u.reason}`);
    staged.push(u.file_path);
  }
  if (staged.length > 0) {
    await run(["git", "add", ...staged]);
  }
}

async function main(): Promise<void> {
  // 1. Get staged files
  const stagedRaw = await run(["git", "diff", "--cached", "--name-only"]);
  const allStaged = stagedRaw.trim().split("\n").filter(Boolean);
  const relevant = filterRelevantFiles(allStaged);

  if (relevant.length === 0) {
    console.log("[doc-check] No relevant source files staged — skipping.");
    process.exit(0);
  }

  const hasDocChanges = allStaged.some((f) => f.startsWith("docs/"));
  if (hasDocChanges) {
    console.log("[doc-check] Docs already updated in this commit — skipping.");
    process.exit(0);
  }

  console.log(`[doc-check] Checking docs for ${relevant.length} changed file(s)...`);

  // 2. Get diff
  let diff = await run(["git", "diff", "--cached", "--", ...relevant]);
  if (diff.length > MAX_DIFF_BYTES) {
    diff = diff.slice(0, MAX_DIFF_BYTES) + "\n\n[DIFF TRUNCATED — showing first 50KB]";
  }

  // 3. Read docs
  const docs = await readAllDocs();

  // 4. Call Claude
  let response: DocUpdateResponse;
  try {
    const raw = await runClaude(buildPrompt(diff, docs));
    // Extract JSON from response (handles any surrounding whitespace or text)
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in Claude response");
    response = JSON.parse(match[0]) as DocUpdateResponse;
  } catch (err) {
    console.log(`[doc-check] Claude call failed: ${err} — skipping doc update.`);
    process.exit(0);
  }

  // 5. Apply updates
  if (response.needs_update && response.updates.length > 0) {
    console.log(`[doc-check] Updating ${response.updates.length} doc(s): ${response.change_summary}`);
    try {
      await applyUpdates(response.updates);
    } catch (err) {
      console.log(`[doc-check] Failed to write docs: ${err} — skipping.`);
    }
  } else {
    console.log(`[doc-check] No doc updates needed: ${response.change_summary}`);
  }

  process.exit(0);
}

main();
