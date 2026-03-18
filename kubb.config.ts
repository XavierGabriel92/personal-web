import "dotenv/config";
import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

const baseURL = process.env.VITE_API_URL as string;

export default defineConfig({
	root: ".",
	input: {
		path: `${baseURL}/openapi/json`,
	},
	output: {
		clean: true,
		path: "./src/gen",
	},
	plugins: [
		pluginOas(),
		pluginTs(),
		pluginClient({
			importPath: "@/lib/client.ts",
		}),
		pluginReactQuery({
			client: {
				importPath: "@/lib/client.ts",
			},
		}),
	],
});
