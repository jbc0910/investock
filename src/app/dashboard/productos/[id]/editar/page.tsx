import { createClient } from '@/utils/supabase/server'
import { updateProducto } from '../../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
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

  // Obtener producto
  const { data: producto } = await supabase
    .from('productos')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('negocio_id', negocio.id)
    .single()

  if (!producto) {
    notFound()
  }

  // Obtener categorías para el select
  const { data: categorias } = await supabase
    .from('categorias')
    .select('id, nombre')
    .eq('negocio_id', negocio.id)
    .order('nombre')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-surface hover:bg-surface-hover border border-border rounded-md transition-colors text-foreground/70">
          <ArrowLeft size={18} />
        </Link>
        <h2 className="text-2xl font-bold">Editar Producto</h2>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-2xl">
        <form action={updateProducto} className="flex flex-col gap-6">
          <input type="hidden" name="id" value={producto.id} />
          
          <div>
            <label className="text-sm font-medium mb-1 block text-foreground/80" htmlFor="nombre">
              Nombre del Producto *
            </label>
            <input
              className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors text-sm"
              name="nombre"
              type="text"
              defaultValue={producto.nombre}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block text-foreground/80" htmlFor="precio">
                Precio ($) *
              </label>
              <input
                className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors text-sm"
                name="precio"
                type="number"
                step="0.01"
                min="0"
                defaultValue={producto.precio}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-foreground/80" htmlFor="stock">
                Stock *
              </label>
              <input
                className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors text-sm"
                name="stock"
                type="number"
                min="0"
                defaultValue={producto.stock}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-foreground/80" htmlFor="categoria_id">
              Categoría
            </label>
            <select 
              name="categoria_id"
              defaultValue={producto.categoria_id || ''}
              className="w-full rounded-md px-4 py-2.5 bg-background border border-border focus:border-primary outline-none transition-colors text-sm text-foreground appearance-none"
            >
              <option value="">Selecciona una categoría...</option>
              {categorias?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-border">
            <Link 
              href="/dashboard"
              className="px-6 py-2.5 rounded-md border border-border hover:bg-surface-hover text-sm font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
