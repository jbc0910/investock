import Link from 'next/link'
import { sendPasswordResetEmail } from './actions'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const message = params?.message as string | undefined
  const sent = params?.sent === 'true'

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border p-8 rounded-xl shadow-2xl">
        {/* Header */}
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
          <p className="text-foreground/60 text-sm text-balance">
            Te enviaremos un enlace a tu correo para restablecer tu contraseña.
          </p>
        </div>

        {sent ? (
          /* ── Estado: correo enviado ── */
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
        ) : (
          /* ── Formulario ── */
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
                name="email"
                type="email"
                placeholder="tu@negocio.com"
                required
              />
            </div>

            {message && (
              <p className="p-3 bg-red-950/30 border border-red-900/50 text-red-500 text-sm rounded-md">
                {message.startsWith('Error:') ? message.replace('Error: ', '') : message}
              </p>
            )}

            <button
              formAction={sendPasswordResetEmail}
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 transition-colors font-semibold"
            >
              Enviar enlace de recuperación
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
