
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { 
  FileText, 
  Printer, 
  Download, 
  Zap, 
  Eye, 
  X,
  Calendar,
  Check,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { REPORT_TEMPLATES, getTemplateBySpecies } from '@/lib/report-templates'

interface ReportGeneratorProps {
  pet: any
  medicalRecord?: any
  onClose?: () => void
}

export function ReportGenerator({ pet, medicalRecord, onClose }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})

  const template = getTemplateBySpecies(pet.species)

  if (!template) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No hay template disponible para {pet.species}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Pre-populate form with pet and medical record data
  const initializeFormData = () => {
    const initialData: { [key: string]: any } = {
      petName: pet.name,
      ownerName: pet.owner?.fullName || '',
      visitDate: medicalRecord?.visitDate ? new Date(medicalRecord.visitDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      breed: pet.breed || '',
      age: pet.age?.toString() || '',
      weight: pet.weight?.toString() || '',
      reasonForVisit: medicalRecord?.reason || '',
      diagnosis: medicalRecord?.diagnosis || '',
      treatment: medicalRecord?.treatment || '',
      medications: medicalRecord?.medications || '',
      observations: medicalRecord?.notes || ''
    }

    // Add vitals if available
    if (medicalRecord?.vitals) {
      if (medicalRecord.vitals.temperature) {
        initialData.temperature = medicalRecord.vitals.temperature.toString()
      }
      if (medicalRecord.vitals.heartRate) {
        initialData.heartRate = medicalRecord.vitals.heartRate.toString()
      }
    }

    setFormData(initialData)
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const generateReport = async () => {
    setIsGenerating(true)

    try {
      // Validate required fields
      const requiredFields = template.fields.filter(field => field.required)
      const missingFields = requiredFields.filter(field => !formData[field.name]?.toString()?.trim())

      if (missingFields.length > 0) {
        toast.error(`Campos requeridos faltantes: ${missingFields.map(f => f.label).join(', ')}`)
        setIsGenerating(false)
        return
      }

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: pet.id,
          medicalRecordId: medicalRecord?.id,
          template: template.id,
          formData
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error generando el reporte')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let reportContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setGeneratedReport(reportContent.trim())
                setShowPreview(true)
                toast.success('Reporte generado exitosamente')
                return
              }
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  reportContent += parsed.content
                  setGeneratedReport(reportContent)
                }
              } catch (e) {
                // Skip invalid JSON chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Error al generar el reporte')
    } finally {
      setIsGenerating(false)
    }
  }

  const printReport = () => {
    if (!generatedReport) return

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reporte Veterinario - ${pet.name}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #22c55e; padding-bottom: 20px; }
              .content { white-space: pre-wrap; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🐾 VeteLoHace</h1>
              <h2>Reporte Veterinario</h2>
              <p><strong>Paciente:</strong> ${pet.name} | <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            <div class="content">${generatedReport.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const saveReport = async () => {
    if (!generatedReport) return

    try {
      const response = await fetch('/api/reports/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: pet.id,
          medicalRecordId: medicalRecord?.id,
          template: template.id,
          content: formData,
          generatedContent: generatedReport
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Reporte guardado exitosamente')
        onClose?.()
      } else {
        toast.error(data.message || 'Error al guardar el reporte')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  // Initialize form data on component mount
  React.useEffect(() => {
    initializeFormData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{template.icon}</span>
          <div>
            <h3 className="text-lg font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        </div>
        
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información del Reporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template.fields.map((field) => (
              <div 
                key={field.name} 
                className={field.type === 'textarea' ? 'md:col-span-2' : ''}
              >
                <Label htmlFor={field.name} className="flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>
                
                {field.type === 'text' && (
                  <Input
                    id={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                
                {field.type === 'number' && (
                  <Input
                    id={field.name}
                    type="number"
                    step="0.1"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                
                {field.type === 'date' && (
                  <Input
                    id={field.name}
                    type="date"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
                
                {field.type === 'select' && field.options && (
                  <Select 
                    value={formData[field.name] || ''} 
                    onValueChange={(value) => handleFieldChange(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Selecciona ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                    rows={3}
                    className="resize-none"
                  />
                )}
                
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={generateReport}
          disabled={isGenerating}
          size="lg"
          className="veterinary-gradient text-white px-8"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="h-5 w-5 mr-2"
              >
                <Zap className="h-5 w-5" />
              </motion.div>
              Generando Reporte...
            </>
          ) : (
            <>
              <FileText className="h-5 w-5 mr-2" />
              Generar Reporte con IA
            </>
          )}
        </Button>
      </div>

      {/* Generated Report Preview */}
      <AnimatePresence>
        {generatedReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Reporte Generado
                </CardTitle>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Ocultar' : 'Vista Previa'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={printReport}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="default" size="sm" onClick={saveReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </CardHeader>
              
              {showPreview && (
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {generatedReport}
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
