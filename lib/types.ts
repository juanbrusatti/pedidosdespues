export interface Profile {
  id: string
  display_name: string | null
  location: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export type ListingType = 'necesito' | 'ofrezco'
export type ListingStatus = 'active' | 'paused' | 'completed'

export const CATEGORIES = [
  'Hogar',
  'Tecnologia',
  'Educacion',
  'Diseno',
  'Salud',
  'Transporte',
  'Otro',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Listing {
  id: string
  user_id: string
  type: ListingType
  title: string
  description: string
  location: string
  price: number | null
  price_negotiable: boolean
  availability: string | null
  category: string | null
  status: ListingStatus
  created_at: string
  updated_at: string
}

export interface ListingWithProfile extends Listing {
  profiles: Profile
}
