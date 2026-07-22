'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error)
    redirect(`/login?message=Error: ${error.message}`)
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: signUpData } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error)
    redirect(`/login?message=Error: ${error.message}`)
  }

  // If email confirmation is enabled, a session might not be created immediately
  if (!signUpData.session) {
    redirect('/login?message=Revisa+tu+correo+para+confirmar+tu+cuenta')
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}
