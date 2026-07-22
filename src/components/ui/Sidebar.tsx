'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Tags, LogOut, ChevronRight, AlertCircle } from 'lucide-react'

interface Props {
  negocioNombre: string
  userInitial: string
}

export function Sidebar({ negocioNombre, userInitial }: Props) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <aside
      className={`
        relative flex flex-col border-r border-border bg-surface
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[72px]' : 'w-64'}
      `}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surface-hover transition-colors shadow-md"
        title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        <ChevronRight
          size={14}
          className={`text-foreground/70 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
        />
      </button>

      {/* Header / Logo */}
      <div className={`border-b border-border overflow-hidden transition-all duration-300 ${collapsed ? 'p-4' : 'p-6'}`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {negocioNombre.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold truncate text-primary">{negocioNombre}</h2>
            <p className="text-sm text-foreground/50 mt-0.5">Investock</p>
          </>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-2 space-y-1">
        <Link
          href="/dashboard"
          title="Inventario"
          className={`flex items-center gap-3 px-3 py-3 rounded-md hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors font-medium ${collapsed ? 'justify-center' : ''}`}
        >
          <LayoutDashboard size={20} className="shrink-0" />
          {!collapsed && <span className="truncate">Inventario</span>}
        </Link>
        <Link
          href="/dashboard/categorias"
          title="Categorías"
          className={`flex items-center gap-3 px-3 py-3 rounded-md hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors font-medium ${collapsed ? 'justify-center' : ''}`}
        >
          <Tags size={20} className="shrink-0" />
          {!collapsed && <span className="truncate">Categorías</span>}
        </Link>
        <Link
          href="/dashboard/agotados"
          title="Agotados"
          className={`flex items-center gap-3 px-3 py-3 rounded-md hover:bg-surface-hover text-red-500/80 hover:text-red-500 transition-colors font-medium ${collapsed ? 'justify-center' : ''}`}
        >
          <AlertCircle size={20} className="shrink-0" />
          {!collapsed && <span className="truncate">Agotados</span>}
        </Link>
      </nav>

      {/* Footer / Sign out */}
      <div className={`p-2 border-t border-border`}>
        <form action="/auth/signout" method="post">
          <button
            title="Cerrar Sesión"
            className={`flex w-full items-center gap-3 px-3 py-3 rounded-md hover:bg-surface-hover text-red-500 hover:text-red-400 transition-colors font-medium ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span className="truncate">Cerrar Sesión</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}
