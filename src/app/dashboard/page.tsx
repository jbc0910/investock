import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Search, AlertCircle, Package2 } from 'lucide-react'
import { deleteProducto } from './productos/actions'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams?.q as string || ''
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Obtener negocio
  const { data: negocio } = await supabase
    .from('negocios')
    .select('id')
    .eq('propietario_id', user.id)
    .single()
  
  if (!negocio) return null

  // Obtener métricas
  const { count: totalProductos } = await supabase
    .from('productos')
    .select('*', { count: 'exact', head: true })
    .eq('negocio_id', negocio.id)

  const { count: agotados } = await supabase
    .from('productos')
    .select('*', { count: 'exact', head: true })
    .eq('negocio_id', negocio.id)
    .lte('stock', 0)

  // Query productos
  let query = supabase
    .from('productos')
    .select(`
      *,
      categorias (nombre)
    `)
    .eq('negocio_id', negocio.id)
    .order('created_at', { ascending: false })

  if (q) {
    query = query.ilike('nombre', `%${q}%`)
  }

  const { data: productos } = await query

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-lg">
            <Package2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Total Productos</p>
            <h3 className="text-3xl font-bold">{totalProductos || 0}</h3>
          </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Agotados</p>
            <h3 className="text-3xl font-bold">{agotados || 0}</h3>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="bg-surface border border-border rounded-xl flex flex-col">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <form className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Buscar producto por nombre..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:border-primary outline-none transition-colors text-sm"
            />
          </form>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link 
              href="/dashboard/exportar"
              className="flex-1 sm:flex-none border border-border hover:bg-surface-hover text-center px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Exportar
            </Link>
            <Link 
              href="/dashboard/importar"
              className="flex-1 sm:flex-none border border-border hover:bg-surface-hover text-center px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Importar
            </Link>
            <Link 
              href="/dashboard/productos/nuevo"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Nuevo Producto
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium text-foreground/70">Nombre</th>
                <th className="px-6 py-3 font-medium text-foreground/70">Categoría</th>
                <th className="px-6 py-3 font-medium text-foreground/70 text-right">Precio</th>
                <th className="px-6 py-3 font-medium text-foreground/70 text-right">Stock</th>
                <th className="px-6 py-3 font-medium text-foreground/70 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                productos?.map((prod) => (
                  <tr key={prod.id} className="border-b border-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{prod.nombre}</td>
                    <td className="px-6 py-4">
                      {prod.categorias ? (
                        <span className="bg-background border border-border px-2 py-1 rounded-md text-xs">
                          {prod.categorias.nombre}
                        </span>
                      ) : (
                        <span className="text-foreground/40 text-xs italic">Sin categoría</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">${prod.precio}</td>
                    <td className="px-6 py-4 text-right">
                      {prod.stock <= 0 ? (
                        <span className="text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md text-xs">Agotado</span>
                      ) : prod.stock <= 5 ? (
                        <span className="text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-md text-xs">{prod.stock} (Bajo)</span>
                      ) : (
                        <span>{prod.stock}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/dashboard/productos/${prod.id}/editar`} className="text-primary hover:underline text-sm">Editar</Link>
                      <form action={deleteProducto} className="inline-block">
                        <input type="hidden" name="id" value={prod.id} />
                        <button type="submit" className="text-red-500 hover:underline text-sm" onClick={(e) => {
                          if(!confirm('¿Estás seguro de que deseas eliminar este producto?')) e.preventDefault()
                        }}>Eliminar</button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
