
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PawPrint, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewPetPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Mascota</h1>
            <p className="text-gray-600 mt-1">
              Registra una nueva mascota para un cliente existente
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Formulario de Nueva Mascota
              </h3>
              <p className="text-gray-600 mb-6">
                Aquí se implementará el formulario para registrar una nueva mascota
              </p>
              <Link href="/dashboard/clients">
                <Button className="veterinary-gradient text-white">
                  Seleccionar Cliente Primero
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
