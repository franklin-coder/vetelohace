
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoiceRecorder } from '@/components/voice-recorder'
import { NewConsultationForm } from '@/components/new-consultation-form'
import { ReportGenerator } from '@/components/report-generator'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  PawPrint, 
  Calendar,
  Stethoscope,
  FileText,
  Plus,
  Edit,
  Printer,
  Eye,
  Mic
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface PetProfileProps {
  pet: any
  currentUser: any
}

export function PetProfileContent({ pet, currentUser }: PetProfileProps) {
  const [showNewConsultation, setShowNewConsultation] = useState(false)
  const [showReportGenerator, setShowReportGenerator] = useState(false)

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

  const getTemplateIcon = (template: string) => {
    const icons: { [key: string]: string } = {
      DOG: '🐕',
      CAT: '🐱',
      BIRD: '🐦',
      RABBIT: '🐰',
      FISH: '🐠'
    }
    return icons[template] || '📄'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="text-6xl">
            {getSpeciesIcon(pet.species)}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
            <p className="text-lg text-gray-600">{getSpeciesName(pet.species)}</p>
            
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Propietario: {pet.owner.fullName}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {pet.owner.phone}
              </div>
              {pet.owner.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {pet.owner.email}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Badge variant="outline">
                {pet.medicalRecords.length} consulta{pet.medicalRecords.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary">
                {pet.reports.length} reporte{pet.reports.length !== 1 ? 's' : ''}
              </Badge>
              {pet.age && (
                <Badge variant="outline">
                  {pet.age} año{pet.age !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
          <Button 
            className="veterinary-gradient text-white"
            onClick={() => setShowNewConsultation(true)}
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            Nueva Consulta
          </Button>
        </div>
      </div>

      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-green-600" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Especie</label>
              <p className="text-gray-900">{getSpeciesName(pet.species)}</p>
            </div>
            
            {pet.breed && (
              <div>
                <label className="text-sm font-medium text-gray-500">Raza</label>
                <p className="text-gray-900">{pet.breed}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-500">Sexo</label>
              <p className="text-gray-900">{getGenderName(pet.gender)}</p>
            </div>
            
            {pet.age && (
              <div>
                <label className="text-sm font-medium text-gray-500">Edad</label>
                <p className="text-gray-900">{pet.age} año{pet.age !== 1 ? 's' : ''}</p>
              </div>
            )}
            
            {pet.weight && (
              <div>
                <label className="text-sm font-medium text-gray-500">Peso</label>
                <p className="text-gray-900">{pet.weight} kg</p>
              </div>
            )}
            
            {pet.color && (
              <div>
                <label className="text-sm font-medium text-gray-500">Color</label>
                <p className="text-gray-900">{pet.color}</p>
              </div>
            )}
            
            {pet.birthDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                <p className="text-gray-900">
                  {new Date(pet.birthDate).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
            
            {pet.microchip && (
              <div>
                <label className="text-sm font-medium text-gray-500">Microchip</label>
                <p className="text-gray-900 font-mono text-sm">{pet.microchip}</p>
              </div>
            )}
          </div>
          
          {pet.notes && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Notas</label>
              <p className="text-gray-900 mt-1">{pet.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Layout principal: Historia clínica (izquierda) + Grabador de voz (derecha) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Historia Clínica - Lado Izquierdo */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  Historia Clínica
                </div>
                <Badge variant="outline">
                  {pet.medicalRecords.length} registro{pet.medicalRecords.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="custom-scrollbar overflow-y-auto max-h-[600px]">
              {pet.medicalRecords.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay consultas registradas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Esta mascota no tiene historial médico aún
                  </p>
                  <Button 
                    className="veterinary-gradient text-white"
                    onClick={() => setShowNewConsultation(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Primera Consulta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pet.medicalRecords.map((record: any, index: number) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">
                            {record.reason}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(record.visitDate).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Dr. {record.veterinarian.name}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        {record.symptoms && (
                          <div>
                            <span className="font-medium text-gray-700">Síntomas:</span>
                            <p className="text-gray-600 mt-1">{record.symptoms}</p>
                          </div>
                        )}
                        
                        {record.diagnosis && (
                          <div>
                            <span className="font-medium text-gray-700">Diagnóstico:</span>
                            <p className="text-gray-600 mt-1">{record.diagnosis}</p>
                          </div>
                        )}
                        
                        {record.treatment && (
                          <div>
                            <span className="font-medium text-gray-700">Tratamiento:</span>
                            <p className="text-gray-600 mt-1">{record.treatment}</p>
                          </div>
                        )}
                        
                        {record.medications && (
                          <div>
                            <span className="font-medium text-gray-700">Medicamentos:</span>
                            <p className="text-gray-600 mt-1">{record.medications}</p>
                          </div>
                        )}
                        
                        {record.transcription && (
                          <div>
                            <span className="font-medium text-gray-700 flex items-center gap-1">
                              <Mic className="h-4 w-4" />
                              Transcripción:
                            </span>
                            <p className="text-gray-600 mt-1 bg-blue-50 p-3 rounded-lg">
                              {record.transcription}
                            </p>
                          </div>
                        )}
                        
                        {record.notes && (
                          <div>
                            <span className="font-medium text-gray-700">Notas:</span>
                            <p className="text-gray-600 mt-1">{record.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {record.reports.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Reportes generados:</span>
                            <div className="flex gap-2">
                              {record.reports.map((report: any) => (
                                <div key={report.id} className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {getTemplateIcon(report.template)} {report.template}
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Printer className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Grabador de Voz - Lado Derecho */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <VoiceRecorder petId={pet.id} />
            
            {/* Botón Generar Reporte prominente */}
            <Card className="mt-4">
              <CardContent className="pt-6">
                <Button 
                  className="w-full veterinary-gradient text-white h-14 text-lg font-semibold"
                  onClick={() => setShowReportGenerator(true)}
                >
                  <FileText className="h-6 w-6 mr-3" />
                  Generar Reporte
                </Button>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Templates disponibles para {getSpeciesName(pet.species).toLowerCase()}
                  </p>
                  <div className="flex justify-center">
                    <Badge variant="outline" className="text-xs">
                      {getTemplateIcon(pet.species)} Template {pet.species}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Nueva Consulta */}
      {showNewConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <NewConsultationForm 
              pet={pet}
              currentUser={currentUser}
              onClose={() => setShowNewConsultation(false)}
              onSuccess={() => {
                setShowNewConsultation(false)
                // TODO: Refresh data
                window.location.reload()
              }}
            />
          </div>
        </div>
      )}

      {/* Modal del Generador de Reportes */}
      {showReportGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ReportGenerator 
                pet={pet}
                medicalRecord={pet.medicalRecords?.[0]} // Use most recent medical record
                onClose={() => setShowReportGenerator(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
