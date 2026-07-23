import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AccountSettings } from '@/components/ui/AccountSettings'

type Tab = 'name' | 'password' | 'delete'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: negocio } = await supabase
    .from('negocios')
    .select('nombre')
    .eq('propietario_id', user.id)
    .single()

  if (!negocio) redirect('/onboarding')

  const params = await searchParams
  const tab = (params?.tab as Tab) || 'name'
  const message = params?.message as string | undefined
  const success = params?.success === 'true'

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configuración de cuenta</h1>
        <p className="text-foreground/50 mt-1 text-sm">
          Administra los datos de tu negocio y las opciones de seguridad.
        </p>
      </div>

      <AccountSettings
        currentName={negocio.nombre}
        tab={tab}
        message={message}
        success={success}
      />
    </div>
  )
}
