
import { createClient } from '@supabase/supabase-js'

// Esta Edge Function elimina un usuario autenticado usando la service_role key.
// PASOS PARA CONFIGURAR EN SUPABASE:
//   1. Instala Supabase CLI: npm install -g supabase
//   2. Ejecuta: supabase functions deploy delete-account --project-ref TU_PROJECT_REF
//   3. Agrega el secreto SUPABASE_SERVICE_ROLE_KEY en:
//      Supabase Dashboard → Settings → Edge Functions → Secrets
//      (el nombre del secreto debe ser exactamente SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req: Request) => {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verificar que el usuario que llama es el mismo que se quiere eliminar
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Cliente con la sesión del usuario (anon key) para verificar identidad
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user || user.id !== userId) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Cliente admin con service_role para eliminar el usuario
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('[delete-account] Error:', deleteError)
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[delete-account] Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
