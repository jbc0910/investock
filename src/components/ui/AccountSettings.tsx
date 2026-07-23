'use client'

import { useState } from 'react'
import { updateBusinessName, updatePassword, deleteAccount } from '@/app/account/actions'

type Tab = 'name' | 'password' | 'delete'

interface Props {
  currentName: string
  tab: Tab
  message?: string
  success?: boolean
}

export function AccountSettings({ currentName, tab: initialTab, message, success }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'name',
      label: 'Nombre del negocio',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
      ),
    },
    {
      id: 'password',
      label: 'Contraseña',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      id: 'delete',
      label: 'Eliminar cuenta',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      ),
    },
  ]

  const showMessage = message
  const showSuccess = success

  return (
    <div className="flex gap-6 flex-col lg:flex-row">
      {/* ── Sidebar de tabs ── */}
      <div className="lg:w-56 shrink-0">
        <nav className="flex flex-row lg:flex-col gap-1 bg-surface border border-border rounded-xl p-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left
                ${activeTab === t.id
                  ? t.id === 'delete'
                    ? 'bg-red-950/40 text-red-400'
                    : 'bg-primary/10 text-primary'
                  : t.id === 'delete'
                    ? 'text-red-500/70 hover:text-red-400 hover:bg-red-950/20'
                    : 'text-foreground/60 hover:text-foreground hover:bg-surface-hover'
                }
              `}
            >
              {t.icon}
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Panel de contenido ── */}
      <div className="flex-1 bg-surface border border-border rounded-xl p-6">

        {/* ══ Nombre del negocio ══ */}
        {activeTab === 'name' && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Nombre del negocio</h2>
            <p className="text-sm text-foreground/50 mb-6">
              Este nombre aparece en toda la aplicación y en los reportes.
            </p>

            {showSuccess && activeTab === 'name' && (
              <div className="mb-4 p-3 bg-green-950/30 border border-green-800/50 text-green-400 text-sm rounded-md">
                Nombre actualizado correctamente.
              </div>
            )}
            {showMessage && (
              <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 text-red-500 text-sm rounded-md">
                {message}
              </div>
            )}

            <form className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block" htmlFor="nombre">
                  Nombre actual
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  defaultValue={currentName}
                  className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
                  placeholder="Ej. Ferretería San José"
                  required
                />
              </div>
              <button
                formAction={updateBusinessName}
                className="self-start bg-primary hover:bg-primary-hover text-white rounded-md px-6 py-2.5 transition-colors font-semibold text-sm"
              >
                Guardar nombre
              </button>
            </form>
          </div>
        )}

        {/* ══ Cambiar contraseña ══ */}
        {activeTab === 'password' && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Cambiar contraseña</h2>
            <p className="text-sm text-foreground/50 mb-6">
              La nueva contraseña debe tener al menos 6 caracteres.
            </p>

            {showSuccess && activeTab === 'password' && (
              <div className="mb-4 p-3 bg-green-950/30 border border-green-800/50 text-green-400 text-sm rounded-md">
                Contraseña actualizada correctamente.
              </div>
            )}
            {showMessage && (
              <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 text-red-500 text-sm rounded-md">
                {message}
              </div>
            )}

            <form className="flex flex-col gap-4 max-w-sm">
              <div>
                <label className="text-sm font-medium mb-1.5 block" htmlFor="password">
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block" htmlFor="confirm">
                  Confirmar contraseña
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <button
                formAction={updatePassword}
                className="self-start bg-primary hover:bg-primary-hover text-white rounded-md px-6 py-2.5 transition-colors font-semibold text-sm"
              >
                Actualizar contraseña
              </button>
            </form>
          </div>
        )}

        {/* ══ Eliminar cuenta ══ */}
        {activeTab === 'delete' && (
          <div>
            <h2 className="text-lg font-semibold mb-1 text-red-400">Eliminar cuenta</h2>
            <p className="text-sm text-foreground/50 mb-4">
              Esta acción es <strong className="text-foreground/80">permanente e irreversible</strong>.
              Se eliminarán tu cuenta, tu negocio y todos los datos asociados.
            </p>

            <div className="mb-6 p-4 bg-red-950/20 border border-red-900/40 rounded-lg">
              <p className="text-sm text-red-400 font-medium mb-1">⚠ Antes de continuar</p>
              <ul className="text-sm text-red-400/80 space-y-1 list-disc list-inside">
                <li>Se eliminará permanentemente tu cuenta de usuario</li>
                <li>Se eliminará tu negocio y todo el inventario</li>
                <li>No podrás recuperar los datos eliminados</li>
              </ul>
            </div>

            {showMessage && (
              <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 text-red-500 text-sm rounded-md">
                {message}
              </div>
            )}

            <form className="flex flex-col gap-4 max-w-sm">
              <div>
                <label className="text-sm font-medium mb-1.5 block" htmlFor="confirm">
                  Para confirmar, escribe{' '}
                  <span className="font-bold text-red-400">ELIMINAR</span>
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="text"
                  className="w-full rounded-md px-4 py-2.5 bg-background border border-red-900/50 focus:border-red-500 outline-none transition-colors text-red-400 font-bold tracking-wider uppercase"
                  placeholder="ELIMINAR"
                  autoComplete="off"
                  required
                />
              </div>
              <button
                formAction={deleteAccount}
                className="self-start bg-red-700 hover:bg-red-600 text-white rounded-md px-6 py-2.5 transition-colors font-semibold text-sm"
              >
                Eliminar mi cuenta permanentemente
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
