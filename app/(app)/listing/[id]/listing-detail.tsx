'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Tag,
  User,
  Pencil,
  Pause,
  Play,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toggleListingStatus } from '@/lib/actions'
import type { ListingWithProfile } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

function formatPrice(price: number | null, negotiable: boolean) {
  if (price === null || negotiable) return 'A convenir'
  return `$${price.toLocaleString('es-MX')}`
}

interface ListingDetailProps {
  listing: ListingWithProfile
  isOwner: boolean
}

export function ListingDetail({ listing, isOwner }: ListingDetailProps) {
  const router = useRouter()
  const isNecesito = listing.type === 'necesito'

  const handleToggleStatus = async () => {
    const newStatus = listing.status === 'active' ? 'paused' : 'active'
    const result = await toggleListingStatus(listing.id, newStatus)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(
        newStatus === 'paused' ? 'Publicacion pausada' : 'Publicacion reactivada'
      )
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-8">
      <div className="flex items-center gap-3">
        <Link
          href="/feed"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Badge
          variant="secondary"
          className={
            isNecesito
              ? 'bg-necesito/15 text-necesito-foreground'
              : 'bg-ofrezco/15 text-ofrezco-foreground'
          }
        >
          {isNecesito ? 'Necesito' : 'Ofrezco'}
        </Badge>
        {listing.status === 'paused' && (
          <Badge variant="outline" className="text-muted-foreground">
            Pausada
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground">
          {listing.title}
        </h1>
        <p className="text-2xl font-semibold text-primary">
          {formatPrice(listing.price, listing.price_negotiable)}
        </p>
      </div>

      <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
        {listing.description}
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{listing.location}</span>
        </div>
        {listing.availability && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{listing.availability}</span>
          </div>
        )}
        {listing.category && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-4 w-4 shrink-0" />
            <span>{listing.category}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            Publicado{' '}
            {formatDistanceToNow(new Date(listing.created_at), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {listing.profiles?.display_name ?? 'Usuario'}
          </span>
          {listing.profiles?.location && (
            <span className="text-xs text-muted-foreground">
              {listing.profiles.location}
            </span>
          )}
        </div>
      </div>

      {isOwner ? (
        <div className="flex flex-col gap-2">
          <Button variant="outline" asChild>
            <Link href={`/listing/${listing.id}/editar`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar publicacion
            </Link>
          </Button>
          <Button variant="ghost" onClick={handleToggleStatus}>
            {listing.status === 'active' ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pausar publicacion
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Reactivar publicacion
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button disabled size="lg" className="w-full">
            Contactar - Proximamente
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            La negociacion directa estara disponible pronto
          </p>
        </div>
      )}
    </div>
  )
}
