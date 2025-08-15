
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const petId = searchParams.get('petId')

    if (!petId) {
      return NextResponse.json({ message: "Pet ID requerido" }, { status: 400 })
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
      }
    })

    if (!pet) {
      return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 })
    }

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: { petId },
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
    })

    return NextResponse.json({ medicalRecords })
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const effectiveClinicId = session.user.ownedClinicId || session.user.clinicId

    if (!effectiveClinicId) {
      return NextResponse.json({ message: "No se encontró clínica asociada" }, { status: 400 })
    }

    const body = await req.json()
    const {
      petId,
      visitDate,
      reason,
      symptoms,
      diagnosis,
      treatment,
      medications,
      notes,
      vitals
    } = body

    // Validar datos requeridos
    if (!petId || !reason) {
      return NextResponse.json(
        { message: "Pet ID y motivo son requeridos" },
        { status: 400 }
      )
    }

    // Verificar que la mascota pertenece a la clínica del usuario
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        owner: { clinicId: effectiveClinicId }
      }
    })

    if (!pet) {
      return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 })
    }

    // Crear registro médico
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        petId,
        veterinarianId: session.user.id,
        visitDate: new Date(visitDate),
        reason,
        symptoms: symptoms || null,
        diagnosis: diagnosis || null,
        treatment: treatment || null,
        medications: medications || null,
        notes: notes || null,
        vitals: vitals || null
      },
      include: {
        veterinarian: {
          select: { 
            id: true, 
            name: true 
          }
        },
        pet: {
          select: {
            id: true,
            name: true,
            species: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Registro médico creado exitosamente",
      medicalRecord
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating medical record:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
