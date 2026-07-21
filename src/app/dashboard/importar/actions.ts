'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

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

  const text = await file.text()
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  
  if (lines.length <= 1) return

  const headers = lines[0].split(',')
  const rows = lines.slice(1)

  const productosToInsert = []

  // Un analizador básico de CSV
  for (const row of rows) {
    const cols = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      if (char === '"' && row[i+1] === '"') {
        current += '"'
        i++ // saltar la doble comilla
      } else if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        cols.push(current)
        current = ''
      } else {
        current += char
      }
    }
    cols.push(current)

    // Formato esperado: Nombre, Descripción, Stock
    if (cols.length >= 3) {
      const nombre = cols[0].trim()
      const descripcion = cols[1].trim()
      const stock = parseInt(cols[2], 10)
      
      if (nombre) {
        productosToInsert.push({
          negocio_id: negocio.id,
          nombre,
          descripcion: descripcion || null,
          stock: isNaN(stock) ? 0 : stock
        })
      }
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
