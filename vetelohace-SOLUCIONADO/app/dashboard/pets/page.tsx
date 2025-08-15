
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PetsContent } from "@/components/pets-content"
import { prisma } from "@/lib/db"

export default async function PetsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  const pets = await getPets(session.user.id, session.user.clinicId || undefined, session.user.ownedClinicId || undefined)

  return (
    <DashboardLayout>
      <PetsContent pets={pets as any} />
    </DashboardLayout>
  )
}

async function getPets(userId: string, clinicId?: string, ownedClinicId?: string) {
  try {
    const effectiveClinicId = ownedClinicId || clinicId

    if (!effectiveClinicId) {
      return []
    }

    const pets = await prisma.pet.findMany({
      where: { 
        owner: {
          clinicId: effectiveClinicId
        },
        isActive: true 
      },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            address: true
          }
        }
      }
    })

    return pets
  } catch (error) {
    console.error('Error fetching pets:', error)
    return []
  }
}
