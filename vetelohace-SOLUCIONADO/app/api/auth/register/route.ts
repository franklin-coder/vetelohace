
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      password,
      userType,
      phone,
      address,
      licenseNumber,
      clinicName,
      clinicAddress,
      clinicPhone
    } = body

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "El usuario ya existe" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario
    const userData = {
      name,
      email,
      password: hashedPassword,
      userType,
      phone,
      address,
      licenseNumber
    }

    let user

    if (userType === 'CLINIC_OWNER') {
      // Crear usuario y clínica en una transacción
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: userData
        })

        const clinic = await tx.clinic.create({
          data: {
            name: clinicName,
            address: clinicAddress,
            phone: clinicPhone,
            email: email,
            ownerId: newUser.id
          }
        })

        return { user: newUser, clinic }
      })

      user = result.user
    } else {
      // Crear solo el usuario veterinario
      user = await prisma.user.create({
        data: userData
      })
    }

    // Remover la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
