import { createClient } from '@/utils/supabase/server'
import { createCategoria, deleteCategoria } from './actions'
import { Trash2 } from 'lucide-react'

export default async function CategoriasPage() {
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

  // Obtener categorías
  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .eq('negocio_id', negocio.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categorías</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="bg-surface border border-border p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Nueva Categoría</h3>
            <form action={createCategoria} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-background border border-border focus:border-primary outline-none transition-colors text-sm"
                  name="nombre"
                  type="text"
                  placeholder="Ej: Bebidas"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-2 transition-colors font-medium text-sm"
              >
                Crear
              </button>
            </form>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias?.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-foreground/50">
                      No hay categorías creadas.
                    </td>
                  </tr>
                ) : (
                  categorias?.map((categoria) => (
                    <tr key={categoria.id} className="border-b border-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{categoria.nombre}</td>
                      <td className="px-6 py-4 text-right">
                        <form action={deleteCategoria}>
                          <input type="hidden" name="id" value={categoria.id} />
                          <button
                            type="submit"
                            className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
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
    </div>
  )
}
