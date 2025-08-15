
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Stethoscope, Calendar, FileText, X, Save, Zap } from 'lucide-react'

interface NewConsultationFormProps {
  pet: any
  currentUser: any
  onClose: () => void
  onSuccess: () => void
}

export function NewConsultationForm({ pet, currentUser, onClose, onSuccess }: NewConsultationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    reason: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
    weight: '',
    temperature: '',
    heartRate: '',
    respiratoryRate: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.reason.trim()) {
      toast.error('El motivo de la consulta es obligatorio')
      setIsLoading(false)
      return
    }

    try {
      // Prepare vitals data
      const vitals = {
        weight: formData.weight ? parseFloat(formData.weight) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        respiratoryRate: formData.respiratoryRate ? parseInt(formData.respiratoryRate) : null
      }

      const consultationData = {
        petId: pet.id,
        visitDate: new Date(formData.visitDate),
        reason: formData.reason,
        symptoms: formData.symptoms || null,
        diagnosis: formData.diagnosis || null,
        treatment: formData.treatment || null,
        medications: formData.medications || null,
        notes: formData.notes || null,
        vitals: Object.values(vitals).some(v => v !== null) ? vitals : null
      }

      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Consulta registrada exitosamente')
        onSuccess()
      } else {
        toast.error(data.message || 'Error al registrar la consulta')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          Nueva Consulta - {pet.name}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitDate">Fecha de la Consulta</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="visitDate"
                  type="date"
                  className="pl-10"
                  value={formData.visitDate}
                  onChange={(e) => handleChange('visitDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de la Consulta *</Label>
              <Input
                id="reason"
                type="text"
                placeholder="Ej: Revisión general, vacunación, síntomas..."
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Signos vitales */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              Signos Vitales
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="25.5"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="38.5"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">FC (lpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="120"
                  value={formData.heartRate}
                  onChange={(e) => handleChange('heartRate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">FR (rpm)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="30"
                  value={formData.respiratoryRate}
                  onChange={(e) => handleChange('respiratoryRate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Campos clínicos */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Síntomas Observados</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe los síntomas que presenta la mascota..."
                value={formData.symptoms}
                onChange={(e) => handleChange('symptoms', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Textarea
                id="diagnosis"
                placeholder="Diagnóstico médico veterinario..."
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Tratamiento</Label>
              <Textarea
                id="treatment"
                placeholder="Plan de tratamiento recomendado..."
                value={formData.treatment}
                onChange={(e) => handleChange('treatment', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Medicamentos</Label>
              <Textarea
                id="medications"
                placeholder="Medicamentos prescritos, dosis, frecuencia..."
                value={formData.medications}
                onChange={(e) => handleChange('medications', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones, recomendaciones adicionales..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="veterinary-gradient text-white flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                'Guardando...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Consulta
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
