import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Zap, MessageCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Cerca
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Crear cuenta</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 pb-20">
        <section className="flex max-w-md flex-col items-center gap-4 text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Servicios locales a tu alcance
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Publica lo que necesitas o lo que ofreces. Conecta con personas cerca de ti de forma directa
            y sin complicaciones.
          </p>
          <div className="flex gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Comenzar gratis</Link>
            </Button>
          </div>
        </section>

        <section className="grid w-full max-w-lg gap-4 md:grid-cols-3 md:max-w-3xl">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Publica en segundos
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Describe lo que necesitas o lo que ofreces. Sin formularios largos.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Cerca de ti
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Encuentra servicios en tu zona. Local, directo, sin intermediarios.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Negocia directo
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Acuerda precio y condiciones directamente con la otra persona.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
