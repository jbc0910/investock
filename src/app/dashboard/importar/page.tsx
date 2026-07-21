import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'
import { importCSV } from './actions'

export default function ImportarPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-surface hover:bg-surface-hover border border-border rounded-md transition-colors text-foreground/70">
          <ArrowLeft size={18} />
        </Link>
        <h2 className="text-2xl font-bold">Importar Productos</h2>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-2xl">
        <p className="text-foreground/70 mb-6 text-sm">
          Sube un archivo CSV con la lista de productos. Asegúrate de que el archivo tenga el siguiente formato (columnas):
          <br /><br />
          <code className="bg-background px-2 py-1 rounded text-xs border border-border font-mono">Nombre, Descripción, Stock</code>
        </p>
        
        <form action={importCSV} className="flex flex-col gap-6">
          <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-background transition-colors">
            <Upload size={32} className="text-foreground/50 mb-4" />
            <label className="text-sm font-medium mb-1 block cursor-pointer" htmlFor="file">
              <span className="text-primary hover:underline">Selecciona un archivo</span> o arrástralo aquí
            </label>
            <input
              className="hidden"
              id="file"
              name="file"
              type="file"
              accept=".csv"
              required
            />
            <p className="text-xs text-foreground/50 mt-2">CSV (máx. 5MB)</p>
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
              Importar Productos
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
