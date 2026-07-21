import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

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
      precio,
      stock,
      categorias (nombre)
    `)
    .eq('negocio_id', negocio.id)
    .order('created_at', { ascending: false })

  if (!productos) {
    return new NextResponse('No hay productos', { status: 404 })
  }

  // Generar CSV
  const header = ['Nombre', 'Precio', 'Stock', 'Categoría'].join(',')
  const rows = productos.map(p => {
    // Escapar comas en los nombres
    const nombre = `"${p.nombre.replace(/"/g, '""')}"`
    const cat = Array.isArray(p.categorias) ? p.categorias[0] : p.categorias;
    const catNombre = cat ? (cat as any).nombre : '';
    const categoria = catNombre ? `"${catNombre.replace(/"/g, '""')}"` : '""'
    return [nombre, p.precio, p.stock, categoria].join(',')
  })

  const csv = [header, ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inventario_${negocio.nombre.replace(/\s+/g, '_').toLowerCase()}.csv"`,
    },
  })
}
