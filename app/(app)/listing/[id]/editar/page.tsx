import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ListingForm } from '@/components/listing-form'
import type { Listing } from '@/lib/types'

export default async function EditarListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!listing) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/listing/${id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Editar publicacion
        </h1>
      </div>
      <ListingForm type={(listing as Listing).type} listing={listing as Listing} />
    </div>
  )
}
