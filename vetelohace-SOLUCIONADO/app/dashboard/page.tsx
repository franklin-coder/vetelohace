
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardContent } from "@/components/dashboard-content"
import { DashboardLayout } from "@/components/dashboard-layout"
import { prisma } from "@/lib/db"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  // Obtener estadísticas del dashboard
  const stats = await getDashboardStats(session.user.id, session.user.clinicId || undefined, session.user.ownedClinicId || undefined)

  return (
    <DashboardLayout>
      <DashboardContent stats={stats} user={session.user} />
    </DashboardLayout>
  )
}

async function getDashboardStats(userId: string, clinicId?: string, ownedClinicId?: string) {
  try {
    const effectiveClinicId = ownedClinicId || clinicId

    if (!effectiveClinicId) {
      return {
        totalClients: 0,
        totalPets: 0,
        todayConsultations: 0,
        pendingReports: 0,
        recentClients: [],
        recentConsultations: []
      }
    }

    const [
      totalClients,
      totalPets,
      todayConsultations,
      pendingReports,
      recentClients,
      recentConsultations
    ] = await Promise.all([
      prisma.client.count({
        where: { clinicId: effectiveClinicId }
      }),
      prisma.pet.count({
        where: { 
          owner: { clinicId: effectiveClinicId },
          isActive: true 
        }
      }),
      prisma.medicalRecord.count({
        where: {
          pet: { owner: { clinicId: effectiveClinicId } },
          visitDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.report.count({
        where: {
          pet: { owner: { clinicId: effectiveClinicId } },
          isPrinted: false
        }
      }),
      prisma.client.findMany({
        where: { clinicId: effectiveClinicId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          pets: {
            where: { isActive: true },
            select: { id: true, name: true, species: true }
          }
        }
      }),
      prisma.medicalRecord.findMany({
        where: {
          pet: { owner: { clinicId: effectiveClinicId } }
        },
        orderBy: { visitDate: 'desc' },
        take: 5,
        include: {
          pet: {
            select: { id: true, name: true, species: true }
          },
          veterinarian: {
            select: { name: true }
          }
        }
      })
    ])

    return {
      totalClients,
      totalPets,
      todayConsultations,
      pendingReports,
      recentClients,
      recentConsultations
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalClients: 0,
      totalPets: 0,
      todayConsultations: 0,
      pendingReports: 0,
      recentClients: [],
      recentConsultations: []
    }
  }
}
