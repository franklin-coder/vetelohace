
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  PawPrint, 
  Calendar,
  Stethoscope,
  Plus,
  Edit,
  Eye,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSafeDate } from '@/hooks/use-safe-date'

interface ClientDetailsProps {
  client: any
  currentUser: any
}

export function ClientDetailsContent({ client, currentUser }: ClientDetailsProps) {
  const [selectedPet, setSelectedPet] = useState(client.pets?.[0]?.id || null)
  const { formatDate, getYear } = useSafeDate()

  const getSpeciesIcon = (species: string) => {
    const icons: { [key: string]: string } = {
      DOG: '🐕',
      CAT: '🐱',
      BIRD: '🐦',
      RABBIT: '🐰',
      FISH: '🐠',
      OTHER: '🐾'
    }
    return icons[species] || '🐾'
  }

  const getSpeciesName = (species: string) => {
    const names: { [key: string]: string } = {
      DOG: 'Perro',
      CAT: 'Gato',
      BIRD: 'Ave',
      RABBIT: 'Conejo',
      FISH: 'Pez',
      OTHER: 'Otro'
    }
    return names[species] || 'Otro'
  }

  const getGenderName = (gender: string | null | undefined) => {
    if (!gender) return 'No especificado'
    const names: { [key: string]: string } = {
      MALE: 'Macho',
      FEMALE: 'Hembra',
      UNKNOWN: 'No determinado'
    }
    return names[gender] || 'No especificado'
  }

  const selectedPetData = client.pets.find((pet: any) => pet.id === selectedPet)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
              {client.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.fullName}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {client.phone}
              </div>
              {client.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {client.email}
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {client.address}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline">
                {client.pets.length} mascota{client.pets.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary">
                Cliente desde {getYear(client.createdAt)}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar Cliente
          </Button>
          <Link href={`/dashboard/pets/new?clientId=${client.id}`}>
            <Button className="veterinary-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Mascota
            </Button>
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panel izquierdo - Lista de mascotas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-green-600" />
                Mascotas ({client.pets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.pets.length === 0 ? (
                <div className="text-center py-8">
                  <PawPrint className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No hay mascotas registradas</p>
                  <Link href={`/dashboard/pets/new?clientId=${client.id}`}>
                    <Button size="sm" className="veterinary-gradient text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Mascota
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {client.pets.map((pet: any, index: number) => (
                    <motion.div
                      key={pet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPet === pet.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPet(pet.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getSpeciesIcon(pet.species)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                            <p className="text-sm text-gray-600">
                              {getSpeciesName(pet.species)}
                              {pet.breed && ` • ${pet.breed}`}
                            </p>
                            {pet.age && (
                              <p className="text-xs text-gray-500">{pet.age} años</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="text-xs">
                            {pet._count.medicalRecords} consultas
                          </Badge>
                          {pet._count.reports > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {pet._count.reports} reportes
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel derecho - Detalles de la mascota seleccionada */}
        <div className="lg:col-span-2">
          {!selectedPetData ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona una mascota
                  </h3>
                  <p className="text-gray-600">
                    Elige una mascota del panel izquierdo para ver sus detalles
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="info" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="medical">Historia Clínica</TabsTrigger>
                  <TabsTrigger value="reports">Reportes</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Link href={`/dashboard/pets/${selectedPetData.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Perfil Completo
                    </Button>
                  </Link>
                  <Link href={`/dashboard/pets/${selectedPetData.id}/consultation`}>
                    <Button size="sm" className="veterinary-gradient text-white">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Nueva Consulta
                    </Button>
                  </Link>
                </div>
              </div>

              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getSpeciesIcon(selectedPetData.species)}
                      {selectedPetData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Especie</label>
                        <p className="text-gray-900">{getSpeciesName(selectedPetData.species)}</p>
                      </div>
                      
                      {selectedPetData.breed && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Raza</label>
                          <p className="text-gray-900">{selectedPetData.breed}</p>
                        </div>
                      )}
                      
                      {selectedPetData.age && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Edad</label>
                          <p className="text-gray-900">{selectedPetData.age} años</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Sexo</label>
                        <p className="text-gray-900">{getGenderName(selectedPetData.gender)}</p>
                      </div>
                      
                      {selectedPetData.weight && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Peso</label>
                          <p className="text-gray-900">{selectedPetData.weight} kg</p>
                        </div>
                      )}
                      
                      {selectedPetData.color && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Color</label>
                          <p className="text-gray-900">{selectedPetData.color}</p>
                        </div>
                      )}
                      
                      {selectedPetData.microchip && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Microchip</label>
                          <p className="text-gray-900 font-mono text-sm">{selectedPetData.microchip}</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedPetData.notes && (
                      <div className="mt-6">
                        <label className="text-sm font-medium text-gray-500">Notas</label>
                        <p className="text-gray-900 mt-1">{selectedPetData.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medical">
                <Card>
                  <CardHeader>
                    <CardTitle>Historia Clínica</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPetData.medicalRecords.length === 0 ? (
                      <div className="text-center py-8">
                        <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">No hay consultas registradas</p>
                        <Link href={`/dashboard/pets/${selectedPetData.id}/consultation`}>
                          <Button className="veterinary-gradient text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Primera Consulta
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPetData.medicalRecords.map((record: any) => (
                          <div key={record.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{record.reason}</h4>
                              <span className="text-sm text-gray-500">
                                {formatDate(record.visitDate)}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              {record.diagnosis && (
                                <p><strong>Diagnóstico:</strong> {record.diagnosis}</p>
                              )}
                              {record.treatment && (
                                <p><strong>Tratamiento:</strong> {record.treatment}</p>
                              )}
                              <p><strong>Veterinario:</strong> {record.veterinarian.name}</p>
                            </div>
                            
                            {record.reports.length > 0 && (
                              <div className="mt-2">
                                <div className="flex gap-2">
                                  {record.reports.map((report: any) => (
                                    <Badge key={report.id} variant="outline" className="text-xs">
                                      Reporte {report.template}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {selectedPetData._count.medicalRecords > 5 && (
                          <div className="text-center">
                            <Link href={`/dashboard/pets/${selectedPetData.id}`}>
                              <Button variant="outline">
                                Ver todas las consultas ({selectedPetData._count.medicalRecords})
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Reportes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Lista de reportes próximamente</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
