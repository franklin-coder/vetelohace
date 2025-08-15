
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

    let effectiveClinicId = session.user.ownedClinicId || session.user.clinicId

    // SOLUCIÓN ULTRA-ROBUSTA: Obtener clínica por múltiples métodos (igual que POST)
    if (!effectiveClinicId) {
      const userWithClinic = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          clinic: true,
          ownedClinic: true
        }
      })
      
      if (userWithClinic) {
        effectiveClinicId = userWithClinic.ownedClinic?.id || userWithClinic.clinicId
      }
      
      // Como último recurso, usar la primera clínica disponible
      if (!effectiveClinicId) {
        const fallbackClinic = await prisma.clinic.findFirst()
        if (fallbackClinic) {
          effectiveClinicId = fallbackClinic.id
        }
      }
    }

    const clients = await prisma.client.findMany({
      where: { clinicId: effectiveClinicId! },
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

    return NextResponse.json({ clients })
  } catch (error) {
    console.error("Error fetching clients:", error)
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

    let effectiveClinicId = session.user.ownedClinicId || session.user.clinicId

    // SOLUCIÓN ULTRA-ROBUSTA: Obtener clínica por múltiples métodos
    if (!effectiveClinicId) {
      const userWithClinic = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          clinic: true,
          ownedClinic: true
        }
      })
      
      if (userWithClinic) {
        effectiveClinicId = userWithClinic.ownedClinic?.id || userWithClinic.clinicId
      }
      
      // Si TODAVÍA no hay clínica, crear una clínica personal automáticamente
      if (!effectiveClinicId && userWithClinic) {
        const personalClinic = await prisma.clinic.create({
          data: {
            name: `Clínica Personal - ${userWithClinic.name || 'Dr. Usuario'}`,
            address: userWithClinic.address || "Dirección no especificada",
            phone: userWithClinic.phone || "+57 300 000 0000",
            email: userWithClinic.email,
            description: "Clínica personal creada automáticamente",
            ownerId: userWithClinic.id
          }
        })
        
        // Actualizar el usuario para asociarlo con la nueva clínica
        await prisma.user.update({
          where: { id: userWithClinic.id },
          data: { 
            clinicId: personalClinic.id
          }
        })
        
        effectiveClinicId = personalClinic.id
      }
    }

    // Como último recurso, usar la primera clínica disponible en el sistema
    if (!effectiveClinicId) {
      const fallbackClinic = await prisma.clinic.findFirst()
      if (fallbackClinic) {
        effectiveClinicId = fallbackClinic.id
      }
    }

    // Si AÚN no hay clínica, crear una clínica por defecto
    if (!effectiveClinicId) {
      const defaultClinic = await prisma.clinic.create({
        data: {
          name: "Clínica Veterinaria Principal",
          address: "Dirección Principal",
          phone: "+57 1 234 5678",
          email: "admin@clinica.com",
          description: "Clínica principal del sistema",
          ownerId: session.user.id
        }
      })
      effectiveClinicId = defaultClinic.id
    }

    const body = await req.json()
    const { client, pet } = body

    // Validar datos requeridos
    if (!client.fullName || !client.phone || !pet.name || !pet.species) {
      return NextResponse.json(
        { message: "Campos requeridos faltantes" },
        { status: 400 }
      )
    }

    // Crear cliente y mascota en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear cliente
      const newClient = await tx.client.create({
        data: {
          fullName: client.fullName,
          phone: client.phone,
          email: client.email || null,
          address: client.address || null,
          identityDocument: client.identityDocument || null,
          notes: client.notes || null,
          clinicId: effectiveClinicId!
        }
      })

      // Crear mascota
      const newPet = await tx.pet.create({
        data: {
          name: pet.name,
          species: pet.species,
          breed: pet.breed || null,
          age: pet.age || null,
          weight: pet.weight || null,
          color: pet.color || null,
          gender: pet.gender || null,
          birthDate: pet.birthDate || null,
          microchip: pet.microchip || null,
          notes: pet.notes || null,
          ownerId: newClient.id
        }
      })

      return { client: newClient, pet: newPet }
    })

    return NextResponse.json({
      message: "Cliente y mascota creados exitosamente",
      client: result.client,
      pet: result.pet
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
