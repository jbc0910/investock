import { createClient } from '@/utils/supabase/server'
import { AlertCircle, Package2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AgotadosPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Obtener negocio
  const { data: negocio } = await supabase
    .from('negocios')
    .select('id')
    .eq('propietario_id', user.id)
    .single()
  
  if (!negocio) return null

  // Obtener productos agotados
  const { data: productos } = await supabase
    .from('productos')
    .select(`
      *,
      categorias (nombre)
    `)
    .eq('negocio_id', negocio.id)
    .lte('stock', 0)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard" className="p-2 bg-surface hover:bg-surface-hover border border-border rounded-md transition-colors text-foreground/70">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-red-500">
            <AlertCircle size={24} />
            Productos Agotados
          </h2>
          <p className="text-foreground/60 text-sm mt-1">
            Solo lectura. Estos productos necesitan ser reabastecidos.
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-4 md:px-6 py-3 font-medium text-foreground/70">Nombre</th>
                <th className="px-4 md:px-6 py-3 font-medium text-foreground/70 hidden sm:table-cell">Categoría</th>
                <th className="px-4 md:px-6 py-3 font-medium text-foreground/70 hidden lg:table-cell">Descripción</th>
                <th className="px-4 md:px-6 py-3 font-medium text-foreground/70 text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {!productos || productos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-foreground/50">
                    No tienes productos agotados. ¡Excelente!
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.id} className="border-b border-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        {prod.imagen_url ? (
                          <img
                            src={prod.imagen_url}
                            alt={prod.nombre}
                            className="w-9 h-9 rounded-md object-cover border border-border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-md bg-background border border-border flex items-center justify-center flex-shrink-0 text-foreground/30">
                            <Package2 size={14} />
                          </div>
                        )}
                        <span className="font-medium text-sm">{prod.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                      {prod.categorias ? (
                        <span className="bg-background border border-border px-2 py-1 rounded-md text-xs">
                          {prod.categorias.nombre}
                        </span>
                      ) : (
                        <span className="text-foreground/40 text-xs italic">Sin categoría</span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-foreground/60 text-sm max-w-xs truncate hidden lg:table-cell">{prod.descripcion || <span className="italic">Sin descripción</span>}</td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <span className="text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md text-xs">
                        Agotado ({prod.stock})
                      </span>
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
