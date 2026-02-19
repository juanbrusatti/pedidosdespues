'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { ListingType } from '@/lib/types'

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const type = formData.get('type') as ListingType
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const location = (formData.get('location') as string)?.trim()
  const priceNegotiable = formData.get('price_negotiable') === 'true'
  const priceRaw = formData.get('price') as string
  const price = priceNegotiable || !priceRaw ? null : parseFloat(priceRaw)
  const availability = (formData.get('availability') as string)?.trim() || null
  const category = (formData.get('category') as string) || null

  if (!title || !description || !location || !type) {
    return { error: 'Todos los campos obligatorios deben estar completos' }
  }

  if (title.length > 80) {
    return { error: 'El titulo no puede tener mas de 80 caracteres' }
  }

  const { error } = await supabase.from('listings').insert({
    user_id: user.id,
    type,
    title,
    description,
    location,
    price,
    price_negotiable: priceNegotiable,
    availability,
    category,
  })

  if (error) {
    return { error: 'No se pudo crear la publicacion. Intenta de nuevo.' }
  }

  revalidatePath('/feed')
  revalidatePath('/mis-publicaciones')
  redirect('/feed')
}

export async function updateListing(listingId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const location = (formData.get('location') as string)?.trim()
  const priceNegotiable = formData.get('price_negotiable') === 'true'
  const priceRaw = formData.get('price') as string
  const price = priceNegotiable || !priceRaw ? null : parseFloat(priceRaw)
  const availability = (formData.get('availability') as string)?.trim() || null
  const category = (formData.get('category') as string) || null

  if (!title || !description || !location) {
    return { error: 'Todos los campos obligatorios deben estar completos' }
  }

  const { error } = await supabase
    .from('listings')
    .update({
      title,
      description,
      location,
      price,
      price_negotiable: priceNegotiable,
      availability,
      category,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listingId)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'No se pudo actualizar la publicacion.' }
  }

  revalidatePath('/feed')
  revalidatePath('/mis-publicaciones')
  redirect('/mis-publicaciones')
}

export async function toggleListingStatus(listingId: string, newStatus: 'active' | 'paused') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('listings')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', listingId)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'No se pudo cambiar el estado.' }
  }

  revalidatePath('/feed')
  revalidatePath('/mis-publicaciones')
  return { success: true }
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'No se pudo eliminar la publicacion.' }
  }

  revalidatePath('/feed')
  revalidatePath('/mis-publicaciones')
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const displayName = (formData.get('display_name') as string)?.trim()
  const location = (formData.get('location') as string)?.trim() || null
  const bio = (formData.get('bio') as string)?.trim() || null

  if (!displayName) {
    return { error: 'El nombre es obligatorio' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      location,
      bio,
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'No se pudo actualizar el perfil.' }
  }

  revalidatePath('/perfil')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
