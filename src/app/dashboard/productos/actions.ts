'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const BUCKET = 'product-images'

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

// Sube una imagen y devuelve la URL pública. Elimina la anterior si existe.
async function uploadImage(supabase: any, negocio_id: string, file: File, oldUrl?: string | null): Promise<string | null> {
  if (!file || file.size === 0) return null

  // Eliminar imagen anterior si existe
  if (oldUrl) {
    const oldPath = extractStoragePath(oldUrl)
    if (oldPath) {
      await supabase.storage.from(BUCKET).remove([oldPath])
    }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${negocio_id}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: false })

  if (error) {
    console.error('Error subiendo imagen:', error)
    return null
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

// Extrae el path relativo desde una URL pública de Supabase Storage
function extractStoragePath(url: string): string | null {
  try {
    const match = url.match(/product-images\/(.+)$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export async function createProducto(formData: FormData) {
  const supabase = await createClient()
  const negocio_id = await getNegocioId(supabase)
  
  if (!negocio_id) return redirect('/login')

  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string
  const stock = parseInt(formData.get('stock') as string, 10)
  const categoria_id = formData.get('categoria_id') as string
  const imagenFile = formData.get('imagen') as File

  if (!nombre || isNaN(stock)) return

  // Subir imagen si se proporcionó
  const imagen_url = await uploadImage(supabase, negocio_id, imagenFile)

  await supabase
    .from('productos')
    .insert([{ 
      negocio_id, 
      nombre, 
      descripcion: descripcion || null, 
      stock, 
      categoria_id: categoria_id || null,
      imagen_url
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
  const descripcion = formData.get('descripcion') as string
  const stock = parseInt(formData.get('stock') as string, 10)
  const categoria_id = formData.get('categoria_id') as string
  const imagenFile = formData.get('imagen') as File
  const imagenActual = formData.get('imagen_actual') as string

  if (!id || !nombre || isNaN(stock)) return

  // Preparar los datos a actualizar
  const updateData: Record<string, any> = {
    nombre, 
    descripcion: descripcion || null, 
    stock, 
    categoria_id: categoria_id || null
  }

  // Solo subir si se envió una imagen nueva
  if (imagenFile && imagenFile.size > 0) {
    const nueva_url = await uploadImage(supabase, negocio_id, imagenFile, imagenActual || null)
    if (nueva_url) updateData.imagen_url = nueva_url
  }

  await supabase
    .from('productos')
    .update(updateData)
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

  // Obtener la imagen antes de eliminar el producto
  const { data: producto } = await supabase
    .from('productos')
    .select('imagen_url')
    .eq('id', id)
    .eq('negocio_id', negocio_id)
    .single()

  // Eliminar producto
  await supabase
    .from('productos')
    .delete()
    .eq('id', id)
    .eq('negocio_id', negocio_id)

  // Eliminar imagen del storage si existía
  if (producto?.imagen_url) {
    const path = extractStoragePath(producto.imagen_url)
    if (path) {
      await supabase.storage.from(BUCKET).remove([path])
    }
  }

  revalidatePath('/dashboard')
}
