'use server'

import { createClient } from '@/utils/supabase/server'

export async function sendPasswordResetEmail(email: string) {
  try {
    console.log('[ForgotPassword] Action started for email:', email)

    if (!email?.trim()) {
      return { error: 'El correo es requerido' }
    }

    const supabase = await createClient()
    console.log('[ForgotPassword] Supabase client created')

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      // Configura esta URL en Supabase → Authentication → URL Configuration → Redirect URLs
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account?tab=password`,
    })

    if (error) {
      console.error('[ForgotPassword] Supabase error:', error)
      return { error: error.message }
    }

    console.log('[ForgotPassword] Email sent successfully')
    return { success: true }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[ForgotPassword] Unexpected error:', err)
    return { error: `Error interno: ${error.message || 'Desconocido'}` }
  }
}
