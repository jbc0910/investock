'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

async function getNegocioId(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: negocio } = await supabase
    .from('negocios')
    .select('id')
    .eq('propietario_id', user.id)
    .single()
  
  return negocio?.id
}

export async function createCategoria(formData: FormData) {
  const supabase = await createClient()
  const negocio_id = await getNegocioId(supabase)
  
  if (!negocio_id) return redirect('/login')

  const nombre = formData.get('nombre') as string
  if (!nombre) return

  const { error } = await supabase
    .from('categorias')
    .insert([{ negocio_id, nombre }])

  revalidatePath('/dashboard/categorias')
}

export async function deleteCategoria(formData: FormData) {
  const supabase = await createClient()
  const negocio_id = await getNegocioId(supabase)
  
  if (!negocio_id) return redirect('/login')

  const id = formData.get('id') as string
  if (!id) return

  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id)
    .eq('negocio_id', negocio_id)

  revalidatePath('/dashboard/categorias')
}
