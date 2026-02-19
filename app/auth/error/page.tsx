import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Cerca
            </h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Algo salio mal</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ocurrio un error inesperado. Por favor intenta de nuevo.
                </p>
              )}
              <Link
                href="/auth/login"
                className="text-sm font-medium text-primary underline underline-offset-4 text-center"
              >
                Volver a iniciar sesion
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
