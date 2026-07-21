import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Tags, LogOut, LayoutDashboard } from 'lucide-react'

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

  // Get negocio
  const { data: negocio } = await supabase
    .from('negocios')
    .select('nombre')
    .eq('propietario_id', user.id)
    .single()

  if (!negocio) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-border bg-surface">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold truncate text-primary">{negocio.nombre}</h2>
          <p className="text-sm text-foreground/50">Premium Nocturnal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors font-medium">
            <LayoutDashboard size={20} />
            Inventario
          </Link>
          <Link href="/dashboard/categorias" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors font-medium">
            <Tags size={20} />
            Categorías
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-md hover:bg-surface-hover text-red-500 hover:text-red-400 transition-colors font-medium">
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
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
