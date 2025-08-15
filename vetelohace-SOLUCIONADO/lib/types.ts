
import { UserType, Species, Gender, RecordStatus } from '@prisma/client'
import { ReportTemplate as PrismaReportTemplate } from '@prisma/client'

export interface User {
  id: string
  name?: string
  email: string
  userType: UserType
  licenseNumber?: string
  phone?: string
  address?: string
  clinicId?: string
  ownedClinicId?: string
}

export interface Client {
  id: string
  fullName: string
  phone: string
  email?: string | null
  address?: string | null
  identityDocument?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  pets: Pet[]
}

export interface Pet {
  id: string
  name: string
  species: Species
  breed?: string
  age?: number
  weight?: number
  color?: string
  gender?: Gender
  birthDate?: Date
  photo?: string
  microchip?: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  medicalRecords: MedicalRecord[]
}

export interface MedicalRecord {
  id: string
  visitDate: Date
  reason: string
  symptoms?: string
  diagnosis?: string
  treatment?: string
  medications?: string
  notes?: string
  voiceRecording?: string
  transcription?: string
  vitals?: any
  status: RecordStatus
  createdAt: Date
  updatedAt: Date
  pet: Pet
  veterinarian: User
  reports: Report[]
}

export interface Report {
  id: string
  petName: string
  ownerName: string
  visitDate: Date
  diagnosis: string
  medications?: string
  dosage?: string
  recommendations?: string
  nextVisit?: Date
  template: PrismaReportTemplate
  content: any
  generatedContent?: string
  isPrinted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface VoiceRecordingState {
  isRecording: boolean
  audioBlob?: Blob
  audioUrl?: string
  transcription?: string
  isTranscribing: boolean
}

export interface ReportField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'number'
  required: boolean
  options?: string[]
  placeholder?: string
  description?: string
}
