'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListingCard } from '@/components/listing-card'
import type { ListingWithProfile } from '@/lib/types'

interface FeedContentProps {
  listings: ListingWithProfile[]
}

export function FeedContent({ listings }: FeedContentProps) {
  const [filter, setFilter] = useState<'todo' | 'necesito' | 'ofrezco'>('todo')
  const [search, setSearch] = useState('')

  const filtered = listings.filter((listing) => {
    const matchesType = filter === 'todo' || listing.type === filter
    const matchesSearch =
      !search ||
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.description.toLowerCase().includes(search.toLowerCase()) ||
      listing.location.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cerca
        </h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar servicios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as typeof filter)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="todo" className="flex-1">
            Todo
          </TabsTrigger>
          <TabsTrigger value="necesito" className="flex-1">
            Necesito
          </TabsTrigger>
          <TabsTrigger value="ofrezco" className="flex-1">
            Ofrezco
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            {search
              ? 'No se encontraron resultados'
              : 'Aun no hay publicaciones'}
          </p>
          <p className="text-sm text-muted-foreground">
            {search
              ? 'Intenta con otros terminos de busqueda'
              : 'Se el primero en publicar algo'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
