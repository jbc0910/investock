'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// ── Cambiar nombre del negocio ─────────────────────────────────────────────
export async function updateBusinessName(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const nombre = (formData.get('nombre') as string)?.trim()
  if (!nombre) redirect('/account?tab=name&message=El+nombre+no+puede+estar+vacío')

  const { error } = await supabase
    .from('negocios')
    .update({ nombre })
    .eq('propietario_id', user.id)

  if (error) {
    console.error('[AccountActions] updateBusinessName:', error)
    redirect(`/account?tab=name&message=${encodeURIComponent('Error al actualizar el nombre')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/account?tab=name&success=true')
}

// ── Cambiar contraseña ─────────────────────────────────────────────────────
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!password || password.length < 6) {
    redirect('/account?tab=password&message=La+contraseña+debe+tener+al+menos+6+caracteres')
  }
  if (password !== confirm) {
    redirect('/account?tab=password&message=Las+contraseñas+no+coinciden')
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('[AccountActions] updatePassword:', error)
    redirect(`/account?tab=password&message=${encodeURIComponent(error.message)}`)
  }

  redirect('/account?tab=password&success=true')
}

// ── Eliminar cuenta ────────────────────────────────────────────────────────
// CONFIGURACIÓN REQUERIDA EN SUPABASE:
//   Crea una Edge Function llamada "delete-account" con la service_role key.
//   Código de ejemplo en: /supabase/functions/delete-account/index.ts
//   (ya incluido en este proyecto).
//
//   Alternativamente, en el Plan Pro puedes habilitar en:
//   Authentication → Providers → Email → "Allow users to delete their own accounts"
export async function deleteAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const confirm = formData.get('confirm') as string
  if (confirm !== 'ELIMINAR') {
    redirect('/account?tab=delete&message=Escribe+ELIMINAR+para+confirmar')
  }

  // 1. Eliminar negocio (las demás tablas deberían tener CASCADE configurado en Supabase)
  await supabase.from('negocios').delete().eq('propietario_id', user.id)

  // 2. Llamar a la Edge Function que elimina el usuario con service_role key
  const { error } = await supabase.functions.invoke('delete-account', {
    body: { userId: user.id },
  })

  if (error) {
    console.error('[AccountActions] deleteAccount:', error)
    redirect('/account?tab=delete&message=' + encodeURIComponent('No se pudo eliminar la cuenta. Verifica que la Edge Function "delete-account" esté configurada en Supabase.'))
  }

  // 3. Sign out y redirigir
  await supabase.auth.signOut()
  redirect('/login')
}
