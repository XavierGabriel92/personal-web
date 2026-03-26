import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Spinner } from '@/components/ui/spinner'
import { sessionQueryKey } from '@/hooks/auth'
import { authClient } from '@/lib/auth-client'
import { queryClient } from '@/routes/__root'
import { zodResolver } from '@hookform/resolvers/zod'
import { parsePhoneNumberWithError } from 'libphonenumber-js'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  phone: z
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
    ),
})

type FormValues = z.infer<typeof formSchema>

export default function PhoneSetupDialog({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone: '' },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: FormValues) => {
    const { error } = await authClient.updateUser({ phone: values.phone })
    if (error) {
      if (error.code === 'DUPLICATE_ENTRY' || error.message?.toLowerCase().includes('unique')) {
        toast.error('Este telefone já está cadastrado em outra conta.')
      } else {
        toast.error('Erro ao salvar telefone. Tente novamente.')
      }
      return
    }
    await queryClient.invalidateQueries({ queryKey: sessionQueryKey })
    onSuccess?.()
  }

  return (
    <Dialog open modal>
      <DialogContent
        className="sm:max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>Adicione seu telefone</DialogTitle>
              <DialogDescription>
                Para continuar, cadastre um número de telefone brasileiro na sua conta.
              </DialogDescription>
            </DialogHeader>

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

            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
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
      </DialogContent>
    </Dialog>
  )
}
