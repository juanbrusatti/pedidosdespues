import { createClient } from '@/lib/supabase/server'
import type { ListingWithProfile } from '@/lib/types'
import { FeedContent } from './feed-content'

export default async function FeedPage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('*, profiles(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <FeedContent
      listings={(listings as ListingWithProfile[]) ?? []}
    />
  )
}
