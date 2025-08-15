
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/db"

interface ConsultationPageProps {
  params: {
    id: string
  }
}

export default async function ConsultationPage({ params }: ConsultationPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  const pet = await getPetBasicInfo(params.id, session.user.clinicId || undefined, session.user.ownedClinicId || undefined)

  if (!pet) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/dashboard/pets/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Perfil
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Consulta</h1>
            <p className="text-gray-600 mt-1">
              Registrar nueva consulta para {pet.name}
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Formulario de Nueva Consulta
              </h3>
              <p className="text-gray-600 mb-6">
                El formulario de consulta se abrirá desde el perfil de la mascota
              </p>
              <Link href={`/dashboard/pets/${params.id}`}>
                <Button className="veterinary-gradient text-white">
                  Ir al Perfil de {pet.name}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

async function getPetBasicInfo(petId: string, clinicId?: string, ownedClinicId?: string) {
  try {
    const effectiveClinicId = ownedClinicId || clinicId

    if (!effectiveClinicId) {
      return null
    }

    const pet = await prisma.pet.findFirst({
      where: { 
        id: petId,
        owner: { clinicId: effectiveClinicId }
      },
      select: {
        id: true,
        name: true,
        species: true
      }
    })

    return pet
  } catch (error) {
    console.error('Error fetching pet basic info:', error)
    return null
  }
}
