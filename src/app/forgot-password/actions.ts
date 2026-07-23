'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function sendPasswordResetEmail(formData: FormData) {
  try {
    const email = formData.get('email') as string
    console.log('[ForgotPassword] Action started for email:', email)

    if (!email?.trim()) {
      return redirect('/forgot-password?message=El+correo+es+requerido')
    }

    const supabase = await createClient()
    console.log('[ForgotPassword] Supabase client created')

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account?tab=password`,
    })

    if (error) {
      console.error('[ForgotPassword] Supabase error:', error)
      return redirect(`/forgot-password?message=Error:+${encodeURIComponent(error.message)}`)
    }

    console.log('[ForgotPassword] Email sent successfully')
    return redirect('/forgot-password?sent=true')
  } catch (err: unknown) {
    const error = err as Error;
    // Si es un error de redirección de Next.js, lo dejamos pasar
    if (error.message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.error('[ForgotPassword] Unexpected error:', err)
    return redirect(`/forgot-password?message=Error+interno:+${encodeURIComponent(error.message || 'Desconocido')}`)
  }
}
