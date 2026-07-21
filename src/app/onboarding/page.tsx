import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createNegocio } from './actions'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar si ya tiene un negocio
  const { data: negocio } = await supabase
    .from('negocios')
    .select('id')
    .eq('propietario_id', user.id)
    .single()

  if (negocio) {
    redirect('/dashboard')
  }

  const resolvedSearchParams = await searchParams
  const message = resolvedSearchParams?.message as string

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Configura tu Negocio</h1>
        <p className="text-center text-foreground/70 mb-8 text-balance">
          Ingresa el nombre de tu negocio para comenzar a gestionar tu inventario.
        </p>

        <form action={createNegocio} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block" htmlFor="nombre">
              Nombre del Negocio
            </label>
            <input
              className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
              name="nombre"
              type="text"
              placeholder="Ej: Mi Tienda Exclusiva"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 transition-colors font-semibold"
          >
            Continuar al Dashboard
          </button>
          
          {message && (
            <p className="mt-4 p-4 bg-red-950/30 border border-red-900/50 text-red-500 text-center text-sm rounded-md">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
