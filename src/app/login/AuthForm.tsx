'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login, signup } from './actions'

export function AuthForm({ message }: { message?: string }) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="w-full max-w-md bg-surface border border-border p-8 rounded-xl shadow-2xl transition-all">
      <h1 className="text-3xl font-bold mb-2 text-center">Investock</h1>
      <p className="text-center text-foreground/70 mb-8 text-balance">
        {isLogin ? 'Inicia sesión para gestionar tu inventario' : 'Crea una cuenta nueva para tu negocio'}
      </p>

      <form className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
            name="email"
            type="email"
            placeholder="tu@negocio.com"
            required
          />
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium" htmlFor="password">
              Contraseña
            </label>
            {isLogin && (
              <Link
                href="/forgot-password"
                className="text-xs text-foreground/50 hover:text-primary transition-colors"
              >
                ¿Olvidaste la contraseña?
              </Link>
            )}
          </div>
          <input
            className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button
          formAction={isLogin ? login : signup}
          className="w-full bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 transition-colors font-semibold"
        >
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </button>
        
        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-foreground/50 text-sm">o</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full border border-border hover:bg-surface-hover text-foreground rounded-md px-4 py-2.5 transition-colors font-medium"
        >
          {isLogin ? 'Ir a Crear Cuenta' : 'Ya tengo una cuenta'}
        </button>
        
        {message && (
          <p className="mt-4 p-4 bg-red-950/30 border border-red-900/50 text-red-500 text-center text-sm rounded-md">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
