
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientDetailsContent } from "@/components/client-details-content"
import { prisma } from "@/lib/db"

interface ClientDetailsPageProps {
  params: {
    id: string
  }
}

export default async function ClientDetailsPage({ params }: ClientDetailsPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  const client = await getClientDetails(params.id, session.user.clinicId || undefined, session.user.ownedClinicId || undefined)

  if (!client) {
    notFound()
  }

  return (
    <DashboardLayout>
      <ClientDetailsContent client={client} currentUser={session.user} />
    </DashboardLayout>
  )
}

async function getClientDetails(clientId: string, clinicId?: string, ownedClinicId?: string) {
  try {
    const effectiveClinicId = ownedClinicId || clinicId

    if (!effectiveClinicId) {
      return null
    }

    const client = await prisma.client.findFirst({
      where: { 
        id: clientId,
        clinicId: effectiveClinicId 
      },
      include: {
        pets: {
          where: { isActive: true },
          include: {
            medicalRecords: {
              orderBy: { visitDate: 'desc' },
              take: 5,
              include: {
                veterinarian: {
                  select: { name: true }
                },
                reports: {
                  select: { id: true, template: true, isPrinted: true }
                }
              }
            },
            _count: {
              select: {
                medicalRecords: true,
                reports: true
              }
            }
          }
        }
      }
    })

    return client
  } catch (error) {
    console.error('Error fetching client details:', error)
    return null
  }
}
