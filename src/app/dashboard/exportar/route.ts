import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import * as xlsx from 'xlsx'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Obtener negocio
  const { data: negocio } = await supabase
    .from('negocios')
    .select('id, nombre')
    .eq('propietario_id', user.id)
    .single()
  
  if (!negocio) {
    return new NextResponse('Negocio no encontrado', { status: 404 })
  }

  // Obtener productos
  const { data: productos } = await supabase
    .from('productos')
    .select(`
      nombre,
      descripcion,
      stock,
      categorias (nombre)
    `)
    .eq('negocio_id', negocio.id)
    .order('created_at', { ascending: false })

  if (!productos) {
    return new NextResponse('No hay productos', { status: 404 })
  }

  // Preparar datos para Excel
  const excelData = productos.map(p => {
    const cat = Array.isArray(p.categorias) ? p.categorias[0] : p.categorias;
    const catNombre = cat ? (cat as any).nombre : '';
    
    return {
      Nombre: p.nombre,
      Descripción: p.descripcion || '',
      Stock: p.stock,
      Categoría: catNombre
    }
  })

  // Generar Excel
  const worksheet = xlsx.utils.json_to_sheet(excelData)
  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Inventario')
  
  const buf = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="inventario_${negocio.nombre.replace(/\s+/g, '_').toLowerCase()}.xlsx"`,
    },
  })
}
