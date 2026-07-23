'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function sendPasswordResetEmail(formData: FormData) {
  const email = formData.get('email') as string

  if (!email?.trim()) {
    redirect('/forgot-password?message=El+correo+es+requerido')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    // Configura esta URL en Supabase → Authentication → URL Configuration → Redirect URLs
    // Debe apuntar a /account?tab=password para que el usuario pueda cambiar su contraseña
    // tras hacer clic en el enlace del correo.
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account?tab=password`,
  })

  if (error) {
    console.error('[ForgotPassword] Error:', error)
    redirect(`/forgot-password?message=Error:+${encodeURIComponent(error.message)}`)
  }

  redirect('/forgot-password?sent=true')
}
