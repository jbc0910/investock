'use client'

import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

interface Props {
  currentUrl?: string | null
  inputName?: string
}

export function ImageUploader({ currentUrl, inputName = 'imagen' }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  function handleRemove() {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block text-foreground/80">
        Imagen del Producto
      </label>

      {preview ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-background group">
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <ImagePlus size={16} />
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-sm px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <X size={16} />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/60 bg-background hover:bg-primary/5 flex flex-col items-center justify-center gap-3 transition-all group"
        >
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            <ImagePlus size={24} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors">
              Haz clic para subir una imagen
            </p>
            <p className="text-xs text-foreground/40 mt-1">PNG, JPG, WEBP · máx. 5MB</p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        name={inputName}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
