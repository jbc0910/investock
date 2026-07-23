'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from './actions'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Introduce un correo válido.')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    const result = await sendPasswordResetEmail(email)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      setStep(1) // Volver al inicio si hay error
    } else if (result?.success) {
      setStep(3)
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border p-8 rounded-xl shadow-2xl">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al login
          </Link>
          <h1 className="text-3xl font-bold mb-2">Recuperar contraseña</h1>
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            <p className="text-foreground/60 text-sm mb-2 text-balance">
              Ingresa tu correo y te enviaremos un enlace para cambiar tu contraseña.
            </p>
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
                type="email"
                placeholder="tu@negocio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="p-3 bg-red-950/30 border border-red-900/50 text-red-500 text-sm rounded-md">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 transition-colors font-semibold"
            >
              Siguiente
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-foreground/80 mb-4">
              Se enviará un correo con la confirmación a:<br/>
              <strong className="text-foreground">{email}</strong>
            </p>
            {error && (
              <p className="p-3 bg-red-950/30 border border-red-900/50 text-red-500 text-sm rounded-md text-left">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 border border-border hover:bg-surface-hover text-foreground rounded-md px-4 py-2.5 transition-colors font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-green-950/30 border border-green-800/50 text-green-400 rounded-md text-sm leading-relaxed">
              <p className="font-semibold mb-1">¡Correo enviado!</p>
              <p>
                Revisa tu bandeja de entrada y sigue las instrucciones. Si no lo
                encuentras, revisa la carpeta de spam.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full text-center bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 transition-colors font-semibold text-sm"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
