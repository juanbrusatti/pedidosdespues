'use client'

import { useState } from 'react'
import { ArrowLeft, HandHelping, Wrench } from 'lucide-react'
import Link from 'next/link'
import { ListingForm } from '@/components/listing-form'
import type { ListingType } from '@/lib/types'

export default function PublicarPage() {
  const [selectedType, setSelectedType] = useState<ListingType | null>(null)

  return (
    <div className="flex flex-col gap-6 px-4 pt-4">
      <div className="flex items-center gap-3">
        {selectedType ? (
          <button
            onClick={() => setSelectedType(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link
            href="/feed"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {selectedType
            ? selectedType === 'necesito'
              ? 'Necesito algo'
              : 'Ofrezco un servicio'
            : 'Nueva publicacion'}
        </h1>
      </div>

      {!selectedType ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Que quieres publicar?
          </p>
          <button
            onClick={() => setSelectedType('necesito')}
            className="flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 text-left transition-colors hover:border-necesito/40 hover:bg-necesito/5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-necesito/15">
              <HandHelping className="h-6 w-6 text-necesito-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-card-foreground">
                Necesito algo
              </span>
              <span className="text-sm text-muted-foreground">
                Busco a alguien que me ayude con un servicio
              </span>
            </div>
          </button>
          <button
            onClick={() => setSelectedType('ofrezco')}
            className="flex items-center gap-4 rounded-xl border-2 border-border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-card-foreground">
                Ofrezco un servicio
              </span>
              <span className="text-sm text-muted-foreground">
                Quiero ofrecer mis habilidades o servicios
              </span>
            </div>
          </button>
        </div>
      ) : (
        <ListingForm type={selectedType} />
      )}
    </div>
  )
}
