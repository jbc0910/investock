'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import * as xlsx from 'xlsx'

export async function importCSV(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // Obtener negocio
  const { data: negocio } = await supabase
    .from('negocios')
    .select('id')
    .eq('propietario_id', user.id)
    .single()
  
  if (!negocio) return redirect('/onboarding')

  const arrayBuffer = await file.arrayBuffer()
  const workbook = xlsx.read(arrayBuffer, { type: 'array' })
  
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return

  const worksheet = workbook.Sheets[sheetName]
  // Parse as array of objects
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: '' }) as any[]
  
  if (rows.length === 0) return

  const productosToInsert = []

  for (const row of rows) {
    // Expected headers from export: Nombre, Descripción, Stock, Categoría
    // (We will ignore Categoría for now in the import as it's complex to match strings to IDs without a lookup)
    const nombre = row['Nombre']?.toString().trim()
    const descripcion = row['Descripción']?.toString().trim() || row['Descripcion']?.toString().trim()
    const stockRaw = row['Stock']
    const stock = parseInt(stockRaw, 10)
    
    if (nombre) {
      productosToInsert.push({
        negocio_id: negocio.id,
        nombre,
        descripcion: descripcion || null,
        stock: isNaN(stock) ? 0 : stock
      })
    }
  }

  if (productosToInsert.length > 0) {
    const { error } = await supabase
      .from('productos')
      .insert(productosToInsert)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
