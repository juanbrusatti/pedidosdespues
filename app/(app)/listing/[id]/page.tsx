import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { ListingWithProfile } from '@/lib/types'
import { ListingDetail } from './listing-detail'

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: listing } = await supabase
    .from('listings')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (!listing) {
    notFound()
  }

  const isOwner = user?.id === listing.user_id

  return (
    <ListingDetail
      listing={listing as ListingWithProfile}
      isOwner={isOwner}
    />
  )
}
