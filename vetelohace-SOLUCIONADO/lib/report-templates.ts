
import { Species, ReportTemplate as PrismaReportTemplate } from '@prisma/client'

export interface ReportField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'number'
  required: boolean
  options?: string[]
  placeholder?: string
  description?: string
}

export interface ReportTemplate {
  id: PrismaReportTemplate
  name: string
  species: Species
  icon: string
  description: string
  fields: ReportField[]
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'DOG' as PrismaReportTemplate,
    name: 'Reporte Canino',
    species: 'DOG' as Species,
    icon: '🐕',
    description: 'Template especializado para perros con campos específicos para caninos',
    fields: [
      {
        name: 'petName',
        label: 'Nombre del Paciente',
        type: 'text',
        required: true,
        placeholder: 'Rocky'
      },
      {
        name: 'ownerName',
        label: 'Propietario',
        type: 'text',
        required: true,
        placeholder: 'Juan Pérez'
      },
      {
        name: 'visitDate',
        label: 'Fecha de Consulta',
        type: 'date',
        required: true
      },
      {
        name: 'breed',
        label: 'Raza',
        type: 'text',
        required: false,
        placeholder: 'Golden Retriever'
      },
      {
        name: 'age',
        label: 'Edad',
        type: 'text',
        required: false,
        placeholder: '3 años'
      },
      {
        name: 'weight',
        label: 'Peso',
        type: 'number',
        required: false,
        placeholder: '25.5 kg'
      },
      {
        name: 'temperature',
        label: 'Temperatura',
        type: 'number',
        required: false,
        placeholder: '38.5°C'
      },
      {
        name: 'heartRate',
        label: 'Frecuencia Cardíaca',
        type: 'number',
        required: false,
        placeholder: '120 lpm'
      },
      {
        name: 'vaccinations',
        label: 'Estado de Vacunación',
        type: 'select',
        required: false,
        options: ['Al día', 'Pendiente', 'Refuerzo necesario', 'No vacunado']
      },
      {
        name: 'reasonForVisit',
        label: 'Motivo de la Consulta',
        type: 'textarea',
        required: true,
        placeholder: 'Revisión general, síntomas observados...'
      },
      {
        name: 'physicalExam',
        label: 'Examen Físico',
        type: 'textarea',
        required: false,
        placeholder: 'Hallazgos del examen físico general...'
      },
      {
        name: 'diagnosis',
        label: 'Diagnóstico',
        type: 'textarea',
        required: true,
        placeholder: 'Diagnóstico principal y diferencial...'
      },
      {
        name: 'treatment',
        label: 'Plan de Tratamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Tratamiento recomendado...'
      },
      {
        name: 'medications',
        label: 'Medicamentos Prescritos',
        type: 'textarea',
        required: false,
        placeholder: 'Medicamento, dosis, frecuencia, duración...'
      },
      {
        name: 'dietRecommendations',
        label: 'Recomendaciones Dietéticas',
        type: 'textarea',
        required: false,
        placeholder: 'Dieta especial, alimentos a evitar...'
      },
      {
        name: 'exerciseRecommendations',
        label: 'Recomendaciones de Ejercicio',
        type: 'textarea',
        required: false,
        placeholder: 'Tipo y cantidad de ejercicio recomendado...'
      },
      {
        name: 'nextVisit',
        label: 'Próxima Cita',
        type: 'date',
        required: false
      },
      {
        name: 'observations',
        label: 'Observaciones Adicionales',
        type: 'textarea',
        required: false,
        placeholder: 'Notas adicionales, instrucciones especiales...'
      }
    ]
  },
  {
    id: 'CAT' as PrismaReportTemplate,
    name: 'Reporte Felino',
    species: 'CAT' as Species,
    icon: '🐱',
    description: 'Template especializado para gatos con consideraciones felinas específicas',
    fields: [
      {
        name: 'petName',
        label: 'Nombre del Paciente',
        type: 'text',
        required: true,
        placeholder: 'Whiskers'
      },
      {
        name: 'ownerName',
        label: 'Propietario',
        type: 'text',
        required: true,
        placeholder: 'María García'
      },
      {
        name: 'visitDate',
        label: 'Fecha de Consulta',
        type: 'date',
        required: true
      },
      {
        name: 'breed',
        label: 'Raza',
        type: 'text',
        required: false,
        placeholder: 'Persa, Siamés, Mestizo...'
      },
      {
        name: 'age',
        label: 'Edad',
        type: 'text',
        required: false,
        placeholder: '2 años'
      },
      {
        name: 'weight',
        label: 'Peso',
        type: 'number',
        required: false,
        placeholder: '4.5 kg'
      },
      {
        name: 'temperature',
        label: 'Temperatura',
        type: 'number',
        required: false,
        placeholder: '38.9°C'
      },
      {
        name: 'indoorOutdoor',
        label: 'Tipo de Vida',
        type: 'select',
        required: false,
        options: ['Interior únicamente', 'Exterior únicamente', 'Interior/Exterior', 'No especificado']
      },
      {
        name: 'litterBoxHabits',
        label: 'Hábitos de Caja de Arena',
        type: 'select',
        required: false,
        options: ['Normal', 'Problemas ocasionales', 'Problemas frecuentes', 'No usa caja']
      },
      {
        name: 'reasonForVisit',
        label: 'Motivo de la Consulta',
        type: 'textarea',
        required: true,
        placeholder: 'Revisión general, síntomas observados...'
      },
      {
        name: 'behaviorAssessment',
        label: 'Evaluación de Comportamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Comportamiento durante la consulta, nivel de estrés...'
      },
      {
        name: 'physicalExam',
        label: 'Examen Físico',
        type: 'textarea',
        required: false,
        placeholder: 'Hallazgos del examen físico, palpación...'
      },
      {
        name: 'oralExam',
        label: 'Examen Oral/Dental',
        type: 'textarea',
        required: false,
        placeholder: 'Estado dental, encías, halitosis...'
      },
      {
        name: 'diagnosis',
        label: 'Diagnóstico',
        type: 'textarea',
        required: true,
        placeholder: 'Diagnóstico principal y diferencial...'
      },
      {
        name: 'treatment',
        label: 'Plan de Tratamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Tratamiento recomendado...'
      },
      {
        name: 'medications',
        label: 'Medicamentos Prescritos',
        type: 'textarea',
        required: false,
        placeholder: 'Medicamento, dosis, frecuencia, duración...'
      },
      {
        name: 'dietRecommendations',
        label: 'Recomendaciones Dietéticas',
        type: 'textarea',
        required: false,
        placeholder: 'Tipo de alimento, cantidad, frecuencia...'
      },
      {
        name: 'environmentalEnrichment',
        label: 'Enriquecimiento Ambiental',
        type: 'textarea',
        required: false,
        placeholder: 'Recomendaciones para mejorar el ambiente...'
      },
      {
        name: 'nextVisit',
        label: 'Próxima Cita',
        type: 'date',
        required: false
      },
      {
        name: 'observations',
        label: 'Observaciones Adicionales',
        type: 'textarea',
        required: false,
        placeholder: 'Notas adicionales, instrucciones especiales...'
      }
    ]
  },
  {
    id: 'BIRD' as PrismaReportTemplate,
    name: 'Reporte Aviar',
    species: 'BIRD' as Species,
    icon: '🐦',
    description: 'Template especializado para aves domésticas y ornamentales',
    fields: [
      {
        name: 'petName',
        label: 'Nombre del Paciente',
        type: 'text',
        required: true,
        placeholder: 'Piolín'
      },
      {
        name: 'ownerName',
        label: 'Propietario',
        type: 'text',
        required: true,
        placeholder: 'Carlos Rodríguez'
      },
      {
        name: 'visitDate',
        label: 'Fecha de Consulta',
        type: 'date',
        required: true
      },
      {
        name: 'species',
        label: 'Especie',
        type: 'text',
        required: false,
        placeholder: 'Canario, Periquito, Loro...'
      },
      {
        name: 'age',
        label: 'Edad',
        type: 'text',
        required: false,
        placeholder: '1 año'
      },
      {
        name: 'weight',
        label: 'Peso',
        type: 'number',
        required: false,
        placeholder: '85 gramos'
      },
      {
        name: 'housingType',
        label: 'Tipo de Alojamiento',
        type: 'select',
        required: false,
        options: ['Jaula individual', 'Jaula comunitaria', 'Aviario', 'Libertad supervisada']
      },
      {
        name: 'diet',
        label: 'Dieta Actual',
        type: 'textarea',
        required: false,
        placeholder: 'Semillas, pellets, frutas, verduras...'
      },
      {
        name: 'reasonForVisit',
        label: 'Motivo de la Consulta',
        type: 'textarea',
        required: true,
        placeholder: 'Revisión general, síntomas observados...'
      },
      {
        name: 'behaviorObservation',
        label: 'Observación de Comportamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Actividad, vocalización, interacción...'
      },
      {
        name: 'physicalExam',
        label: 'Examen Físico',
        type: 'textarea',
        required: false,
        placeholder: 'Plumaje, pico, patas, alas...'
      },
      {
        name: 'respiratoryAssessment',
        label: 'Evaluación Respiratoria',
        type: 'textarea',
        required: false,
        placeholder: 'Patrón respiratorio, sonidos, frecuencia...'
      },
      {
        name: 'diagnosis',
        label: 'Diagnóstico',
        type: 'textarea',
        required: true,
        placeholder: 'Diagnóstico principal y diferencial...'
      },
      {
        name: 'treatment',
        label: 'Plan de Tratamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Tratamiento recomendado...'
      },
      {
        name: 'medications',
        label: 'Medicamentos Prescritos',
        type: 'textarea',
        required: false,
        placeholder: 'Medicamento, dosis, frecuencia, duración...'
      },
      {
        name: 'environmentalRecommendations',
        label: 'Recomendaciones Ambientales',
        type: 'textarea',
        required: false,
        placeholder: 'Temperatura, humedad, iluminación...'
      },
      {
        name: 'dietaryRecommendations',
        label: 'Recomendaciones Dietéticas',
        type: 'textarea',
        required: false,
        placeholder: 'Cambios en la dieta, suplementos...'
      },
      {
        name: 'nextVisit',
        label: 'Próxima Cita',
        type: 'date',
        required: false
      },
      {
        name: 'observations',
        label: 'Observaciones Adicionales',
        type: 'textarea',
        required: false,
        placeholder: 'Notas adicionales, instrucciones especiales...'
      }
    ]
  },
  {
    id: 'RABBIT' as PrismaReportTemplate,
    name: 'Reporte Lagomorfo',
    species: 'RABBIT' as Species,
    icon: '🐰',
    description: 'Template especializado para conejos y otros lagomorfos',
    fields: [
      {
        name: 'petName',
        label: 'Nombre del Paciente',
        type: 'text',
        required: true,
        placeholder: 'Bunny'
      },
      {
        name: 'ownerName',
        label: 'Propietario',
        type: 'text',
        required: true,
        placeholder: 'Ana López'
      },
      {
        name: 'visitDate',
        label: 'Fecha de Consulta',
        type: 'date',
        required: true
      },
      {
        name: 'breed',
        label: 'Raza',
        type: 'text',
        required: false,
        placeholder: 'Holandés, Rex, Angora...'
      },
      {
        name: 'age',
        label: 'Edad',
        type: 'text',
        required: false,
        placeholder: '18 meses'
      },
      {
        name: 'weight',
        label: 'Peso',
        type: 'number',
        required: false,
        placeholder: '2.8 kg'
      },
      {
        name: 'temperature',
        label: 'Temperatura',
        type: 'number',
        required: false,
        placeholder: '38.8°C'
      },
      {
        name: 'housingType',
        label: 'Tipo de Alojamiento',
        type: 'select',
        required: false,
        options: ['Jaula interior', 'Corral exterior', 'Libertad supervisada', 'Mixto']
      },
      {
        name: 'diet',
        label: 'Dieta Actual',
        type: 'textarea',
        required: false,
        placeholder: 'Pellets, heno, verduras, frutas...'
      },
      {
        name: 'cecotrophy',
        label: 'Cecotrofia',
        type: 'select',
        required: false,
        options: ['Normal', 'Reducida', 'Ausente', 'No observada']
      },
      {
        name: 'reasonForVisit',
        label: 'Motivo de la Consulta',
        type: 'textarea',
        required: true,
        placeholder: 'Revisión general, síntomas observados...'
      },
      {
        name: 'behaviorAssessment',
        label: 'Evaluación de Comportamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Actividad, apetito, interacción social...'
      },
      {
        name: 'physicalExam',
        label: 'Examen Físico',
        type: 'textarea',
        required: false,
        placeholder: 'Pelaje, dientes, ojos, orejas...'
      },
      {
        name: 'dentalExam',
        label: 'Examen Dental',
        type: 'textarea',
        required: false,
        placeholder: 'Estado de incisivos y molares, maloclusión...'
      },
      {
        name: 'gastrointestinalAssessment',
        label: 'Evaluación Gastrointestinal',
        type: 'textarea',
        required: false,
        placeholder: 'Palpación abdominal, sonidos intestinales...'
      },
      {
        name: 'diagnosis',
        label: 'Diagnóstico',
        type: 'textarea',
        required: true,
        placeholder: 'Diagnóstico principal y diferencial...'
      },
      {
        name: 'treatment',
        label: 'Plan de Tratamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Tratamiento recomendado...'
      },
      {
        name: 'medications',
        label: 'Medicamentos Prescritos',
        type: 'textarea',
        required: false,
        placeholder: 'Medicamento, dosis, frecuencia, duración...'
      },
      {
        name: 'dietaryRecommendations',
        label: 'Recomendaciones Dietéticas',
        type: 'textarea',
        required: false,
        placeholder: 'Cambios en la dieta, cantidad de heno...'
      },
      {
        name: 'environmentalRecommendations',
        label: 'Recomendaciones Ambientales',
        type: 'textarea',
        required: false,
        placeholder: 'Mejoras en el alojamiento, ejercicio...'
      },
      {
        name: 'nextVisit',
        label: 'Próxima Cita',
        type: 'date',
        required: false
      },
      {
        name: 'observations',
        label: 'Observaciones Adicionales',
        type: 'textarea',
        required: false,
        placeholder: 'Notas adicionales, instrucciones especiales...'
      }
    ]
  },
  {
    id: 'FISH' as PrismaReportTemplate,
    name: 'Reporte Acuático',
    species: 'FISH' as Species,
    icon: '🐠',
    description: 'Template especializado para peces ornamentales y acuarios',
    fields: [
      {
        name: 'petName',
        label: 'Nombre del Paciente/Acuario',
        type: 'text',
        required: true,
        placeholder: 'Nemo / Acuario Principal'
      },
      {
        name: 'ownerName',
        label: 'Propietario',
        type: 'text',
        required: true,
        placeholder: 'Pedro Martínez'
      },
      {
        name: 'visitDate',
        label: 'Fecha de Consulta',
        type: 'date',
        required: true
      },
      {
        name: 'species',
        label: 'Especie',
        type: 'text',
        required: false,
        placeholder: 'Pez dorado, Betta, Ángel...'
      },
      {
        name: 'age',
        label: 'Edad/Tiempo en el Acuario',
        type: 'text',
        required: false,
        placeholder: '6 meses'
      },
      {
        name: 'tankSize',
        label: 'Tamaño del Acuario',
        type: 'text',
        required: false,
        placeholder: '100 litros'
      },
      {
        name: 'waterTemperature',
        label: 'Temperatura del Agua',
        type: 'number',
        required: false,
        placeholder: '24°C'
      },
      {
        name: 'waterPH',
        label: 'pH del Agua',
        type: 'number',
        required: false,
        placeholder: '7.2'
      },
      {
        name: 'waterParameters',
        label: 'Parámetros del Agua',
        type: 'textarea',
        required: false,
        placeholder: 'Amoniaco, nitritos, nitratos, dureza...'
      },
      {
        name: 'tankMates',
        label: 'Compañeros de Acuario',
        type: 'textarea',
        required: false,
        placeholder: 'Otras especies presentes en el acuario...'
      },
      {
        name: 'filtrationSystem',
        label: 'Sistema de Filtración',
        type: 'text',
        required: false,
        placeholder: 'Tipo de filtro y mantenimiento...'
      },
      {
        name: 'reasonForVisit',
        label: 'Motivo de la Consulta',
        type: 'textarea',
        required: true,
        placeholder: 'Síntomas observados, comportamiento anormal...'
      },
      {
        name: 'behaviorObservation',
        label: 'Observación de Comportamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Natación, alimentación, interacción...'
      },
      {
        name: 'physicalExam',
        label: 'Examen Físico',
        type: 'textarea',
        required: false,
        placeholder: 'Aletas, escamas, branquias, ojos...'
      },
      {
        name: 'skinAndFins',
        label: 'Piel y Aletas',
        type: 'textarea',
        required: false,
        placeholder: 'Estado de la piel, aletas, lesiones...'
      },
      {
        name: 'diagnosis',
        label: 'Diagnóstico',
        type: 'textarea',
        required: true,
        placeholder: 'Diagnóstico principal y diferencial...'
      },
      {
        name: 'treatment',
        label: 'Plan de Tratamiento',
        type: 'textarea',
        required: false,
        placeholder: 'Tratamiento recomendado...'
      },
      {
        name: 'medications',
        label: 'Medicamentos/Tratamientos',
        type: 'textarea',
        required: false,
        placeholder: 'Medicamentos, dosis, duración del tratamiento...'
      },
      {
        name: 'waterManagement',
        label: 'Manejo del Agua',
        type: 'textarea',
        required: false,
        placeholder: 'Cambios de agua, ajustes de parámetros...'
      },
      {
        name: 'environmentalRecommendations',
        label: 'Recomendaciones Ambientales',
        type: 'textarea',
        required: false,
        placeholder: 'Mejoras en el acuario, equipamiento...'
      },
      {
        name: 'dietaryRecommendations',
        label: 'Recomendaciones Alimentarias',
        type: 'textarea',
        required: false,
        placeholder: 'Tipo de alimento, frecuencia, cantidad...'
      },
      {
        name: 'nextVisit',
        label: 'Próxima Cita',
        type: 'date',
        required: false
      },
      {
        name: 'observations',
        label: 'Observaciones Adicionales',
        type: 'textarea',
        required: false,
        placeholder: 'Notas adicionales, instrucciones especiales...'
      }
    ]
  }
]

export function getTemplateBySpecies(species: Species): ReportTemplate | undefined {
  return REPORT_TEMPLATES.find(template => template.species === species)
}

export function getTemplateById(id: PrismaReportTemplate): ReportTemplate | undefined {
  return REPORT_TEMPLATES.find(template => template.id === id)
}
