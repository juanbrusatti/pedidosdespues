import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
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
              <CardTitle className="text-xl">Cuenta creada</CardTitle>
              <CardDescription>
                Revisa tu correo para confirmar
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Te enviamos un enlace de confirmacion a tu correo electronico. Haz clic en el
                para activar tu cuenta y empezar a usar Cerca.
              </p>
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
