import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/ui/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: negocio } = await supabase
    .from('negocios')
    .select('nombre')
    .eq('propietario_id', user.id)
    .single()

  if (!negocio) {
    redirect('/onboarding')
  }

  // Inicial del email del usuario para el avatar
  const userInitial = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar negocioNombre={negocio.nombre} userInitial={userInitial} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-md flex items-center px-8 shrink-0">
          <h1 className="text-lg font-medium">Gestión de Inventario</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
