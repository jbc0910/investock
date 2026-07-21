import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const message = resolvedSearchParams?.message as string

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Premium Nocturnal</h1>
        <p className="text-center text-foreground/70 mb-8 text-balance">
          Inicia sesión para gestionar tu inventario
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
            <label className="text-sm font-medium mb-1 block" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            formAction={login}
            className="w-full bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2.5 transition-colors font-semibold"
          >
            Iniciar Sesión
          </button>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-foreground/50 text-sm">o</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          <button
            formAction={signup}
            className="w-full border border-border hover:bg-surface-hover hover:text-white rounded-md px-4 py-2.5 transition-colors font-medium"
          >
            Crear Cuenta
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
