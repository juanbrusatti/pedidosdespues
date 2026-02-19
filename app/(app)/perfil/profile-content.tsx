'use client'

import { useState } from 'react'
import { User, MapPin, FileText, Mail, LogOut, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { updateProfile, signOut } from '@/lib/actions'
import type { Profile } from '@/lib/types'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ProfileContentProps {
  profile: Profile
  email: string
  activeListings: number
}

export function ProfileContent({
  profile,
  email,
  activeListings,
}: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (formData: FormData) => {
    setIsLoading(true)
    const result = await updateProfile(formData)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Perfil actualizado')
      setIsEditing(false)
      router.refresh()
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-8">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Mi perfil
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">
            {profile.display_name ?? 'Sin nombre'}
          </span>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-6 py-3 flex-1">
          <List className="h-4 w-4 text-primary" />
          <span className="text-lg font-bold text-foreground">
            {activeListings}
          </span>
          <span className="text-xs text-muted-foreground">Activas</span>
        </div>
      </div>

      <Separator />

      {isEditing ? (
        <form action={handleSave} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="display_name">Nombre</Label>
            <Input
              id="display_name"
              name="display_name"
              defaultValue={profile.display_name ?? ''}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Ubicacion</Label>
            <Input
              id="location"
              name="location"
              placeholder="Ej: CDMX, Mexico"
              defaultValue={profile.location ?? ''}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Acerca de ti</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Cuenta algo sobre ti..."
              defaultValue={profile.bio ?? ''}
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.bio && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-relaxed">{profile.bio}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span>{email}</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Editar perfil
          </Button>
        </div>
      )}

      <Separator />

      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="text-destructive hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesion
      </Button>
    </div>
  )
}
