'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES, type Listing, type ListingType } from '@/lib/types'
import { createListing, updateListing } from '@/lib/actions'

interface ListingFormProps {
  type: ListingType
  listing?: Listing
}

export function ListingForm({ type, listing }: ListingFormProps) {
  const [priceNegotiable, setPriceNegotiable] = useState(
    listing?.price_negotiable ?? true
  )

  const action = listing
    ? async (_prev: { error?: string } | undefined, formData: FormData) => {
        return await updateListing(listing.id, formData)
      }
    : async (_prev: { error?: string } | undefined, formData: FormData) => {
        return await createListing(formData)
      }

  const [state, formAction, isPending] = useActionState(action, undefined)

  const isNecesito = type === 'necesito'

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="type" value={type} />
      <input
        type="hidden"
        name="price_negotiable"
        value={priceNegotiable.toString()}
      />

      <div className="grid gap-2">
        <Label htmlFor="title">
          {isNecesito ? 'Que necesitas?' : 'Que ofreces?'}
        </Label>
        <Input
          id="title"
          name="title"
          placeholder={
            isNecesito
              ? 'Ej: Plomero para reparar fuga'
              : 'Ej: Clases de guitarra a domicilio'
          }
          defaultValue={listing?.title ?? ''}
          maxLength={80}
          required
          autoFocus
        />
        <p className="text-xs text-muted-foreground">Maximo 80 caracteres</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descripcion</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe con mas detalle lo que necesitas o lo que ofreces..."
          defaultValue={listing?.description ?? ''}
          rows={4}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Ubicacion</Label>
        <Input
          id="location"
          name="location"
          placeholder="Ej: Colonia Roma, CDMX"
          defaultValue={listing?.location ?? ''}
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="price-negotiable">A convenir</Label>
          <Switch
            id="price-negotiable"
            checked={priceNegotiable}
            onCheckedChange={setPriceNegotiable}
          />
        </div>
        {!priceNegotiable && (
          <div className="grid gap-2">
            <Label htmlFor="price">Precio (MXN)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              defaultValue={listing?.price?.toString() ?? ''}
            />
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="availability">Disponibilidad</Label>
        <Input
          id="availability"
          name="availability"
          placeholder="Ej: Esta semana, Lunes a viernes, Hoy"
          defaultValue={listing?.availability ?? ''}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Categoria (opcional)</Label>
        <Select name="category" defaultValue={listing?.category ?? ''}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Seleccionar categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending
          ? 'Publicando...'
          : listing
            ? 'Guardar cambios'
            : 'Publicar'}
      </Button>
    </form>
  )
}
