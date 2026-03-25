import UpgradePlanDialog from '@/components/billing/upgrade-plan-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useGetApiBillingPlanSuspense } from '@/gen/hooks/useGetApiBillingPlanSuspense'
import { getApiBillingPlanSuspenseQueryKey } from '@/gen/hooks/useGetApiBillingPlanSuspense'
import { sessionQueryKey, useCachedSession } from '@/hooks/auth'
import { authClient } from '@/lib/auth-client'
import { queryClient } from '@/routes/__root'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const PLAN_LABELS: Record<string, string> = {
  free: 'Grátis',
  starter: 'Starter',
  pro: 'Pro',
  elite: 'Elite',
}

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})

type FormValues = z.infer<typeof formSchema>

type AccountDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AccountDialogContent({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const { data: session } = useCachedSession()
  const { data: billing } = useGetApiBillingPlanSuspense()
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name ?? '',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: FormValues) => {
    const { error } = await authClient.updateUser({ name: values.name })
    if (error) {
      toast.error('Erro ao atualizar nome. Tente novamente.')
      return
    }
    await queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    await queryClient.invalidateQueries({ queryKey: getApiBillingPlanSuspenseQueryKey() })
    toast.success('Nome atualizado com sucesso!')
    onOpenChange(false)
  }

  const planLabel = PLAN_LABELS[billing.plan] ?? billing.plan
  const isElite = billing.plan === 'elite'
  const clientLimitText = isElite
    ? `${billing.clientCount} alunos`
    : `${billing.clientCount} de ${billing.clientLimit} alunos`

  return (
    <>
      <UpgradePlanDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Conta</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-12 rounded-lg">
                <AvatarImage src={session?.user.image ?? ''} alt={session?.user.name} />
                <AvatarFallback className="rounded-lg text-base">
                  {session?.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <FormLabel>Email</FormLabel>
              <Input value={session?.user.email ?? ''} disabled />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Plano atual</span>
                <span className="text-sm text-muted-foreground">
                  {planLabel} · {clientLimitText}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUpgradeOpen(true)}
              >
                Fazer upgrade
              </Button>
            </div>
            <Separator />
          </div>

          <DialogFooter className="px-6 pb-6">

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export default function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-xl p-2">
        <AccountDialogContent onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}
