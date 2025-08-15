
import { PrismaClient, Species, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...')

  // Crear usuario de prueba obligatorio
  const hashedPassword = await bcrypt.hash('johndoe123', 12)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      name: 'Dr. John Doe',
      email: 'john@doe.com',
      password: hashedPassword,
      userType: 'CLINIC_OWNER',
      licenseNumber: 'VET-2024-001',
      phone: '+57 300 123 4567',
      address: 'Calle 123 #45-67, Bogotá, Colombia'
    }
  })

  console.log('✅ Usuario de prueba creado:', testUser.name)

  // Crear clínica de ejemplo
  const clinic = await prisma.clinic.upsert({
    where: { ownerId: testUser.id },
    update: {},
    create: {
      name: 'Clínica Veterinaria San Martín',
      address: 'Avenida Principal #789, Bogotá, Colombia',
      phone: '+57 1 234 5678',
      email: 'clinica@sanmartin.com',
      description: 'Clínica veterinaria especializada en medicina preventiva y cirugía menor',
      ownerId: testUser.id
    }
  })

  console.log('✅ Clínica creada:', clinic.name)

  // Actualizar el usuario propietario para que también tenga clinicId
  await prisma.user.update({
    where: { id: testUser.id },
    data: { clinicId: clinic.id }
  })

  console.log('✅ Usuario propietario asociado con clínica')

  // Crear veterinario adicional
  const veterinarian = await prisma.user.upsert({
    where: { email: 'maria.rodriguez@sanmartin.com' },
    update: {},
    create: {
      name: 'Dra. María Rodríguez',
      email: 'maria.rodriguez@sanmartin.com',
      password: await bcrypt.hash('password123', 12),
      userType: 'VETERINARIAN',
      licenseNumber: 'VET-2024-002',
      phone: '+57 301 234 5678',
      address: 'Carrera 15 #28-45, Bogotá, Colombia',
      clinicId: clinic.id
    }
  })

  console.log('✅ Veterinario adicional creado:', veterinarian.name)

  // Crear clientes y mascotas de ejemplo
  const clientsData = [
    {
      fullName: 'Carlos Alberto Pérez',
      phone: '+57 300 111 2233',
      email: 'carlos.perez@email.com',
      address: 'Calle 45 #12-34, Bogotá',
      identityDocument: '12345678',
      pets: [
        {
          name: 'Rocky',
          species: 'DOG' as Species,
          breed: 'Golden Retriever',
          age: 3,
          weight: 28.5,
          color: 'Dorado',
          gender: 'MALE' as Gender,
          birthDate: new Date('2021-03-15'),
          microchip: '123456789012345'
        },
        {
          name: 'Bella',
          species: 'DOG' as Species,
          breed: 'Labrador',
          age: 5,
          weight: 25.0,
          color: 'Negro',
          gender: 'FEMALE' as Gender,
          birthDate: new Date('2019-08-22')
        }
      ]
    },
    {
      fullName: 'Ana María González',
      phone: '+57 301 444 5566',
      email: 'ana.gonzalez@email.com',
      address: 'Avenida 68 #45-67, Bogotá',
      identityDocument: '87654321',
      pets: [
        {
          name: 'Whiskers',
          species: 'CAT' as Species,
          breed: 'Persa',
          age: 2,
          weight: 4.2,
          color: 'Blanco',
          gender: 'MALE' as Gender,
          birthDate: new Date('2022-05-10')
        },
        {
          name: 'Luna',
          species: 'CAT' as Species,
          breed: 'Siamés',
          age: 4,
          weight: 3.8,
          color: 'Crema',
          gender: 'FEMALE' as Gender,
          birthDate: new Date('2020-12-03')
        }
      ]
    },
    {
      fullName: 'Roberto Silva',
      phone: '+57 302 777 8899',
      email: 'roberto.silva@email.com',
      address: 'Carrera 30 #78-90, Bogotá',
      pets: [
        {
          name: 'Piolín',
          species: 'BIRD' as Species,
          breed: 'Canario',
          age: 1,
          weight: 0.025,
          color: 'Amarillo',
          gender: 'UNKNOWN' as Gender,
          birthDate: new Date('2023-02-14')
        }
      ]
    },
    {
      fullName: 'Laura Martínez',
      phone: '+57 303 555 6677',
      email: 'laura.martinez@email.com',
      address: 'Calle 100 #15-20, Bogotá',
      pets: [
        {
          name: 'Bunny',
          species: 'RABBIT' as Species,
          breed: 'Holandés',
          age: 2,
          weight: 2.1,
          color: 'Blanco y negro',
          gender: 'FEMALE' as Gender,
          birthDate: new Date('2022-07-30')
        }
      ]
    },
    {
      fullName: 'Pedro Ramírez',
      phone: '+57 304 888 9900',
      email: 'pedro.ramirez@email.com',
      address: 'Avenida Boyacá #123-45, Bogotá',
      pets: [
        {
          name: 'Nemo',
          species: 'FISH' as Species,
          breed: 'Pez dorado',
          age: 1,
          weight: 0.05,
          color: 'Naranja',
          gender: 'UNKNOWN' as Gender,
          birthDate: new Date('2023-06-01')
        }
      ]
    }
  ]

  console.log('🐾 Creando clientes y mascotas...')

  for (const clientData of clientsData) {
    const { pets, ...clientInfo } = clientData
    
    const client = await prisma.client.create({
      data: {
        ...clientInfo,
        clinicId: clinic.id
      }
    })

    console.log(`✅ Cliente creado: ${client.fullName}`)

    for (const petData of pets) {
      const pet = await prisma.pet.create({
        data: {
          ...petData,
          ownerId: client.id
        }
      })

      console.log(`   🐕 Mascota creada: ${pet.name} (${pet.species})`)

      // Crear algunos registros médicos de ejemplo
      const medicalRecords = [
        {
          visitDate: new Date('2024-01-15'),
          reason: 'Revisión general y vacunación',
          symptoms: 'Sin síntomas aparentes, revisión de rutina',
          diagnosis: 'Animal sano, vacunación al día',
          treatment: 'Vacuna múltiple aplicada',
          medications: 'No se requieren medicamentos',
          notes: 'Mascota en excelente estado de salud',
          vitals: JSON.stringify({
            weight: petData.weight,
            temperature: pet.species === 'DOG' ? 38.5 : pet.species === 'CAT' ? 38.9 : null,
            heartRate: pet.species === 'DOG' ? 120 : pet.species === 'CAT' ? 140 : null
          })
        },
        {
          visitDate: new Date('2024-02-20'),
          reason: 'Control post-vacunación',
          symptoms: 'Ninguno',
          diagnosis: 'Evolución favorable post-vacunación',
          treatment: 'Observación',
          notes: 'Respuesta inmune adecuada'
        }
      ]

      for (const recordData of medicalRecords) {
        const medicalRecord = await prisma.medicalRecord.create({
          data: {
            ...recordData,
            petId: pet.id,
            veterinarianId: Math.random() > 0.5 ? testUser.id : veterinarian.id
          }
        })

        // Crear un reporte de ejemplo para algunos registros
        if (Math.random() > 0.5) {
          await prisma.report.create({
            data: {
              petId: pet.id,
              medicalRecordId: medicalRecord.id,
              veterinarianId: medicalRecord.veterinarianId,
              petName: pet.name,
              ownerName: client.fullName,
              visitDate: medicalRecord.visitDate,
              diagnosis: medicalRecord.diagnosis || '',
              medications: medicalRecord.medications,
              recommendations: 'Continuar con cuidados normales. Próxima revisión en 6 meses.',
              template: pet.species as any,
              content: JSON.stringify({
                petName: pet.name,
                ownerName: client.fullName,
                visitDate: medicalRecord.visitDate.toISOString().split('T')[0],
                reasonForVisit: medicalRecord.reason,
                diagnosis: medicalRecord.diagnosis,
                treatment: medicalRecord.treatment,
                medications: medicalRecord.medications,
                observations: medicalRecord.notes
              }),
              generatedContent: `REPORTE VETERINARIO - ${pet.species}

INFORMACIÓN DEL PACIENTE:
Nombre: ${pet.name}
Propietario: ${client.fullName}
Especie: ${pet.species}
Edad: ${pet.age} años
Peso: ${pet.weight} kg

MOTIVO DE LA CONSULTA:
${medicalRecord.reason}

DIAGNÓSTICO:
${medicalRecord.diagnosis}

TRATAMIENTO:
${medicalRecord.treatment}

RECOMENDACIONES:
Continuar con cuidados normales. Próxima revisión programada.

---
Reporte generado por VeteLoHace
Dr. ${medicalRecord.veterinarianId === testUser.id ? testUser.name : veterinarian.name}
Fecha: ${new Date().toLocaleDateString('es-ES')}`
            }
          })
        }
      }
    }
  }

  console.log('🎉 Seeding completado exitosamente!')
  console.log('')
  console.log('📋 INFORMACIÓN DE ACCESO:')
  console.log('Email: john@doe.com')
  console.log('Password: johndoe123')
  console.log('')
  console.log('🏥 Clínica: Clínica Veterinaria San Martín')
  console.log(`📊 Total clientes: ${clientsData.length}`)
  console.log(`🐾 Total mascotas: ${clientsData.reduce((acc, c) => acc + c.pets.length, 0)}`)
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
