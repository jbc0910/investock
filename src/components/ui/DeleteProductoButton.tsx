'use client'

import { deleteProducto } from '@/app/dashboard/productos/actions'

export function DeleteProductoButton({ id }: { id: string }) {
  return (
    <form action={deleteProducto} className="inline-block">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-red-500 hover:underline text-sm"
        onClick={(e) => {
          if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            e.preventDefault()
          }
        }}
      >
        Eliminar
      </button>
    </form>
  )
}
