
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PetProfileContent } from "@/components/pet-profile-content"
import { prisma } from "@/lib/db"

interface PetProfilePageProps {
  params: {
    id: string
  }
}

export default async function PetProfilePage({ params }: PetProfilePageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  const pet = await getPetDetails(params.id, session.user.clinicId || undefined, session.user.ownedClinicId || undefined)

  if (!pet) {
    notFound()
  }

  return (
    <DashboardLayout>
      <PetProfileContent pet={pet} currentUser={session.user} />
    </DashboardLayout>
  )
}

async function getPetDetails(petId: string, clinicId?: string, ownedClinicId?: string) {
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
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            address: true
          }
        },
        medicalRecords: {
          orderBy: { visitDate: 'desc' },
          include: {
            veterinarian: {
              select: { 
                id: true, 
                name: true 
              }
            },
            reports: {
              select: { 
                id: true, 
                template: true, 
                isPrinted: true,
                createdAt: true
              }
            }
          }
        },
        reports: {
          orderBy: { createdAt: 'desc' },
          include: {
            veterinarian: {
              select: { name: true }
            },
            medicalRecord: {
              select: { 
                id: true, 
                visitDate: true, 
                reason: true 
              }
            }
          }
        }
      }
    })

    return pet
  } catch (error) {
    console.error('Error fetching pet details:', error)
    return null
  }
}
