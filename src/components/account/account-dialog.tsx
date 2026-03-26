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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { parsePhoneNumberWithError } from 'libphonenumber-js'
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

const brazilianPhoneSchema = z
  .string()
  .min(1, 'Telefone é obrigatório')
  .refine(
    (phone) => {
      try {
        const phoneNumber = parsePhoneNumberWithError(phone, 'BR')
        return phoneNumber.isValid()
      } catch {
        return false
      }
    },
    { message: 'Telefone deve ser um número brasileiro válido' }
  )

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: brazilianPhoneSchema.optional().or(z.literal('')),
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
  const [phoneWarningOpen, setPhoneWarningOpen] = useState(false)
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name ?? '',
      phone: session?.user.phone ?? '',
    },
  })

  const { isSubmitting } = form.formState

  const doUpdate = async (values: FormValues) => {
    const phone = values.phone || undefined
    const { error } = await authClient.updateUser({ name: values.name, phone })
    if (error) {
      if (error.code === 'DUPLICATE_ENTRY' || error.message?.toLowerCase().includes('unique')) {
        toast.error('Este telefone já está cadastrado em outra conta.')
      } else {
        toast.error('Erro ao atualizar dados. Tente novamente.')
      }
      return
    }
    await queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    await queryClient.invalidateQueries({ queryKey: getApiBillingPlanSuspenseQueryKey() })
    toast.success('Dados atualizados com sucesso!')
    onOpenChange(false)
  }

  const onSubmit = async (values: FormValues) => {
    const currentPhone = session?.user.phone ?? ''
    const newPhone = values.phone ?? ''
    const phoneChanged = newPhone !== currentPhone && newPhone !== ''

    if (phoneChanged) {
      setPendingValues(values)
      setPhoneWarningOpen(true)
      return
    }

    await doUpdate(values)
  }

  const handlePhoneConfirm = async () => {
    setPhoneWarningOpen(false)
    if (pendingValues) {
      await doUpdate(pendingValues)
      setPendingValues(null)
    }
  }

  const planLabel = PLAN_LABELS[billing.plan] ?? billing.plan
  const isElite = billing.plan === 'elite'
  const clientLimitText = isElite
    ? `${billing.clientCount} alunos`
    : `${billing.clientCount} de ${billing.clientLimit} alunos`

  return (
    <>
      <UpgradePlanDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />

      <AlertDialog open={phoneWarningOpen} onOpenChange={setPhoneWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar telefone?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar seu telefone? Este número é usado para identificação da
              sua conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingValues(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePhoneConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(99)99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
