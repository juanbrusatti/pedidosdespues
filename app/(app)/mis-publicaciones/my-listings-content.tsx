'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Clock,
  Pencil,
  Pause,
  Play,
  Trash2,
  PlusCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toggleListingStatus, deleteListing } from '@/lib/actions'
import type { Listing, ListingStatus } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

function formatPrice(price: number | null, negotiable: boolean) {
  if (price === null || negotiable) return 'A convenir'
  return `$${price.toLocaleString('es-MX')}`
}

interface MyListingsContentProps {
  listings: Listing[]
}

export function MyListingsContent({ listings }: MyListingsContentProps) {
  const [tab, setTab] = useState<'active' | 'paused' | 'completed'>('active')
  const router = useRouter()

  const filtered = listings.filter((l) => l.status === tab)

  const handleToggle = async (id: string, currentStatus: ListingStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    const result = await toggleListingStatus(id, newStatus as 'active' | 'paused')
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(
        newStatus === 'paused' ? 'Publicacion pausada' : 'Publicacion reactivada'
      )
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteListing(id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Publicacion eliminada')
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Mis publicaciones
        </h1>
        <Button size="sm" asChild>
          <Link href="/publicar">
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Nueva
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Activas ({listings.filter((l) => l.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="paused" className="flex-1">
            Pausadas ({listings.filter((l) => l.status === 'paused').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completas ({listings.filter((l) => l.status === 'completed').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            {tab === 'active'
              ? 'No tienes publicaciones activas'
              : tab === 'paused'
                ? 'No tienes publicaciones pausadas'
                : 'No tienes publicaciones completadas'}
          </p>
          {tab === 'active' && (
            <Button variant="outline" asChild>
              <Link href="/publicar">Crear publicacion</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {filtered.map((listing) => {
            const isNecesito = listing.type === 'necesito'
            return (
              <div
                key={listing.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-2">
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
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(listing.price, listing.price_negotiable)}
                  </span>
                </div>

                <Link
                  href={`/listing/${listing.id}`}
                  className="flex flex-col gap-1"
                >
                  <h3 className="font-semibold text-card-foreground leading-snug">
                    {listing.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {listing.description}
                  </p>
                </Link>

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
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="flex-1">
                    <Link href={`/listing/${listing.id}/editar`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Editar
                    </Link>
                  </Button>
                  {listing.status !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggle(listing.id, listing.status)}
                    >
                      {listing.status === 'active' ? (
                        <>
                          <Pause className="mr-1.5 h-3.5 w-3.5" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="mr-1.5 h-3.5 w-3.5" />
                          Reactivar
                        </>
                      )}
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar publicacion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta accion no se puede deshacer. Se eliminara la publicacion permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(listing.id)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
