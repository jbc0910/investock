'use client'

import { useTransition } from 'react'
import { adjustStock } from '@/app/dashboard/productos/adjustStock'
import { Minus, Plus } from 'lucide-react'

interface Props {
  id: string
  currentStock: number
}

export function StockAdjuster({ id, currentStock }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleAdjust = (amount: number) => {
    startTransition(() => {
      adjustStock(id, currentStock + amount)
    })
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={isPending || currentStock <= 0}
        onClick={() => handleAdjust(-1)}
        className="w-6 h-6 flex items-center justify-center rounded-md bg-surface border border-border hover:bg-surface-hover disabled:opacity-50 transition-colors"
      >
        <Minus size={12} />
      </button>
      
      <span className={`w-8 text-center text-sm font-medium ${currentStock <= 0 ? 'text-red-500' : currentStock <= 5 ? 'text-amber-500' : ''}`}>
        {currentStock}
      </span>
      
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleAdjust(1)}
        className="w-6 h-6 flex items-center justify-center rounded-md bg-surface border border-border hover:bg-surface-hover disabled:opacity-50 transition-colors"
      >
        <Plus size={12} />
      </button>
    </div>
  )
}
