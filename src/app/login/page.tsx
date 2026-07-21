import { AuthForm } from './AuthForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const message = resolvedSearchParams?.message as string

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen items-center justify-center p-4">
      <AuthForm message={message} />
    </div>
  )
}
