
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientsContent } from "@/components/clients-content"
import { prisma } from "@/lib/db"

export default async function ClientsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  const clients = await getClients(session.user.id, session.user.clinicId || undefined, session.user.ownedClinicId || undefined)

  return (
    <DashboardLayout>
      <ClientsContent clients={clients as any} />
    </DashboardLayout>
  )
}

async function getClients(userId: string, clinicId?: string, ownedClinicId?: string) {
  try {
    const effectiveClinicId = ownedClinicId || clinicId

    if (!effectiveClinicId) {
      return []
    }

    const clients = await prisma.client.findMany({
      where: { clinicId: effectiveClinicId },
      orderBy: { createdAt: 'desc' },
      include: {
        pets: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            age: true,
            photo: true
          }
        },
        _count: {
          select: {
            pets: { where: { isActive: true } }
          }
        }
      }
    })

    return clients
  } catch (error) {
    console.error('Error fetching clients:', error)
    return []
  }
}
