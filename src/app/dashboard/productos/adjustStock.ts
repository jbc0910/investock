'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function adjustStock(id: string, newStock: number) {
  if (!id || isNaN(newStock)) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: negocio } = await supabase
    .from('negocios')
    .select('id')
    .eq('propietario_id', user.id)
    .single()
  
  if (!negocio) return

  await supabase
    .from('productos')
    .update({ stock: Math.max(0, newStock) }) // Evitar stock negativo
    .eq('id', id)
    .eq('negocio_id', negocio.id)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/agotados')
}
