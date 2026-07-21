'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createNegocio(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const nombre = formData.get('nombre') as string
  const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const { error } = await supabase
    .from('negocios')
    .insert([
      { propietario_id: user.id, nombre, slug }
    ])

  if (error) {
    console.error('Error insertando negocio:', error)
    if (error.code === '23505') {
      redirect('/onboarding?message=El+nombre+del+negocio+ya+está+en+uso')
    }
    redirect('/onboarding?message=Error+al+crear+el+negocio')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
