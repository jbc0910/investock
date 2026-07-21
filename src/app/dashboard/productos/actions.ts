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

export async function createProducto(formData: FormData) {
  const supabase = await createClient()
  const negocio_id = await getNegocioId(supabase)
  
  if (!negocio_id) return redirect('/login')

  const nombre = formData.get('nombre') as string
  const precio = parseFloat(formData.get('precio') as string)
  const stock = parseInt(formData.get('stock') as string, 10)
  const categoria_id = formData.get('categoria_id') as string

  if (!nombre || isNaN(precio) || isNaN(stock)) return

  const { error } = await supabase
    .from('productos')
    .insert([{ 
      negocio_id, 
      nombre, 
      precio, 
      stock, 
      categoria_id: categoria_id || null 
    }])

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateProducto(formData: FormData) {
  const supabase = await createClient()
  const negocio_id = await getNegocioId(supabase)
  
  if (!negocio_id) return redirect('/login')

  const id = formData.get('id') as string
  const nombre = formData.get('nombre') as string
  const precio = parseFloat(formData.get('precio') as string)
  const stock = parseInt(formData.get('stock') as string, 10)
  const categoria_id = formData.get('categoria_id') as string

  if (!id || !nombre || isNaN(precio) || isNaN(stock)) return

  const { error } = await supabase
    .from('productos')
    .update({ 
      nombre, 
      precio, 
      stock, 
      categoria_id: categoria_id || null 
    })
    .eq('id', id)
    .eq('negocio_id', negocio_id)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteProducto(formData: FormData) {
  const supabase = await createClient()
  const negocio_id = await getNegocioId(supabase)
  
  if (!negocio_id) return redirect('/login')

  const id = formData.get('id') as string
  if (!id) return

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)
    .eq('negocio_id', negocio_id)

  revalidatePath('/dashboard')
}
