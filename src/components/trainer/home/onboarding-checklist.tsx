import CreateClientSheet from "@/components/clients/sheet/create-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetApiClients } from "@/gen/hooks/useGetApiClients";
import { useGetApiRoutines } from "@/gen/hooks/useGetApiRoutines";
import { usePatchApiTrainerOnboardingFinished } from "@/gen/hooks/usePatchApiTrainerOnboardingFinished";
import { sessionQueryKey, useCachedSession } from "@/hooks/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect } from "react";

interface StepProps {
  label: string;
  done: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

function Step({ label, done, onClick, children }: StepProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
          }`}
      >
        {done && <Check className="h-3 w-3" />}
      </div>
      {done ? (
        <span className="text-sm text-muted-foreground line-through">{label}</span>
      ) : children ? (
        children
      ) : (
        <Button variant="link" size="sm" className="p-0 h-auto text-sm" onClick={onClick}>
          {label}
        </Button>
      )}
    </div>
  );
}

export default function OnboardingChecklist() {
  const { data: session } = useCachedSession();

  if (session?.user.onboardingFinished) return null;

  return <OnboardingChecklistContent />;
}

function OnboardingChecklistContent() {
  const { data: routinesData } = useGetApiRoutines();
  const { data: clientsData } = useGetApiClients();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: markFinished } = usePatchApiTrainerOnboardingFinished({
    mutation: {
      onSuccess: () => queryClient.refetchQueries({ queryKey: sessionQueryKey }),
    },
  });

  const hasRoutine = (routinesData?.routines?.length ?? 0) > 0;
  const hasClient = (clientsData?.clients?.length ?? 0) > 0;
  const hasSession = (clientsData?.clients ?? []).some(c => c.activeRoutineId);
  const allDone = hasRoutine && hasClient && hasSession;

  useEffect(() => {
    if (allDone) markFinished();
  }, [allDone, markFinished]);

  if (allDone) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vamos começar 🚀</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Step
          label="Criar um programa"
          done={hasRoutine}
          onClick={() => navigate({ to: "/trainer/routines" })}
        />
        <Step label="Convidar um aluno" done={hasClient}>
          {!hasClient && <CreateClientSheet Trigger={<Button variant="link" size="sm" className="p-0 h-auto text-sm">
            Criar novo aluno
          </Button>} />}
        </Step>
        <Step
          label="Atribuir um programa ao aluno"
          done={hasSession}
          onClick={() => navigate({ to: "/trainer/clients" })}
        />
      </CardContent>
    </Card>
  );
}
