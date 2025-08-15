
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const {
      petId,
      medicalRecordId,
      template,
      content,
      generatedContent
    } = body

    if (!petId || !template || !content || !generatedContent) {
      return NextResponse.json(
        { message: "Datos requeridos faltantes" },
        { status: 400 }
      )
    }

    const effectiveClinicId = session.user.ownedClinicId || session.user.clinicId

    if (!effectiveClinicId) {
      return NextResponse.json({ message: "No se encontró clínica asociada" }, { status: 400 })
    }

    // Verificar que la mascota pertenece a la clínica del usuario
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        owner: { clinicId: effectiveClinicId }
      },
      include: {
        owner: {
          select: { fullName: true }
        }
      }
    })

    if (!pet) {
      return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 })
    }

    // Verificar que el registro médico existe si se proporciona
    if (medicalRecordId) {
      const medicalRecord = await prisma.medicalRecord.findFirst({
        where: {
          id: medicalRecordId,
          petId: petId
        }
      })

      if (!medicalRecord) {
        return NextResponse.json({ message: "Registro médico no encontrado" }, { status: 404 })
      }
    }

    // Crear el reporte
    const report = await prisma.report.create({
      data: {
        petId,
        medicalRecordId: medicalRecordId || null,
        veterinarianId: session.user.id,
        petName: content.petName || pet.name,
        ownerName: content.ownerName || pet.owner.fullName,
        visitDate: content.visitDate ? new Date(content.visitDate) : new Date(),
        diagnosis: content.diagnosis || '',
        medications: content.medications || null,
        dosage: null, // Could be extracted from medications field
        recommendations: content.observations || null,
        nextVisit: content.nextVisit ? new Date(content.nextVisit) : null,
        template: template as any,
        content,
        generatedContent
      },
      include: {
        pet: {
          select: {
            name: true,
            species: true
          }
        },
        veterinarian: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Reporte guardado exitosamente",
      report
    }, { status: 201 })

  } catch (error) {
    console.error("Error saving report:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
