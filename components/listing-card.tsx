import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ListingWithProfile } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

function formatPrice(price: number | null, negotiable: boolean) {
  if (price === null || negotiable) return 'A convenir'
  return `$${price.toLocaleString('es-MX')}`
}

export function ListingCard({ listing }: { listing: ListingWithProfile }) {
  const isNecesito = listing.type === 'necesito'

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge
          variant="secondary"
          className={
            isNecesito
              ? 'bg-necesito/15 text-necesito-foreground hover:bg-necesito/20'
              : 'bg-ofrezco/15 text-ofrezco-foreground hover:bg-ofrezco/20'
          }
        >
          {isNecesito ? 'Necesito' : 'Ofrezco'}
        </Badge>
        <span className="shrink-0 text-sm font-semibold text-foreground">
          {formatPrice(listing.price, listing.price_negotiable)}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-balance font-semibold leading-snug text-card-foreground group-hover:text-primary transition-colors">
          {listing.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {listing.description}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {listing.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(listing.created_at), {
            addSuffix: true,
            locale: es,
          })}
        </span>
        {listing.profiles?.display_name && (
          <span className="ml-auto truncate">
            {listing.profiles.display_name}
          </span>
        )}
      </div>
    </Link>
  )
}
