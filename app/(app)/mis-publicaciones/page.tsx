import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Listing } from '@/lib/types'
import { MyListingsContent } from './my-listings-content'

export default async function MisPublicacionesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <MyListingsContent listings={(listings as Listing[]) ?? []} />
}
