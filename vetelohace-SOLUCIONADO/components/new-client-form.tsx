
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { User, Phone, Mail, MapPin, FileText, PawPrint, Calendar, Palette, Weight } from 'lucide-react'

export function NewClientForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  
  const [clientForm, setClientForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    identityDocument: '',
    notes: ''
  })

  const [petForm, setPetForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    gender: '',
    birthDate: '',
    microchip: '',
    notes: ''
  })

  const speciesOptions = [
    { value: 'DOG', label: 'Perro 🐕' },
    { value: 'CAT', label: 'Gato 🐱' },
    { value: 'BIRD', label: 'Ave 🐦' },
    { value: 'RABBIT', label: 'Conejo 🐰' },
    { value: 'FISH', label: 'Pez 🐠' },
    { value: 'OTHER', label: 'Otro 🐾' }
  ]

  const genderOptions = [
    { value: 'MALE', label: 'Macho' },
    { value: 'FEMALE', label: 'Hembra' },
    { value: 'UNKNOWN', label: 'No determinado' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!clientForm.fullName || !clientForm.phone || !petForm.name || !petForm.species) {
      toast.error('Por favor completa los campos obligatorios')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: clientForm,
          pet: {
            ...petForm,
            age: petForm.age ? parseInt(petForm.age) : null,
            weight: petForm.weight ? parseFloat(petForm.weight) : null,
            birthDate: petForm.birthDate ? new Date(petForm.birthDate) : null
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(
          `¡Cliente "${data.client.fullName}" y mascota "${data.pet.name}" registrados exitosamente! Encontrarás el registro en tu lista de clientes.`
        )
        // Redirigir a la lista de clientes para que el usuario vea todos sus registros
        router.push('/dashboard/clients')
      } else {
        toast.error(data.message || 'Error al registrar cliente')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Carlos Pérez"
                  className="pl-10"
                  value={clientForm.fullName}
                  onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className="pl-10"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  className="pl-10"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identityDocument">Documento de Identidad</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="identityDocument"
                  type="text"
                  placeholder="12345678"
                  className="pl-10"
                  value={clientForm.identityDocument}
                  onChange={(e) => setClientForm({...clientForm, identityDocument: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                type="text"
                placeholder="Calle 123 #45-67, Barrio, Ciudad"
                className="pl-10"
                value={clientForm.address}
                onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientNotes">Notas adicionales</Label>
            <Textarea
              id="clientNotes"
              placeholder="Información adicional sobre el cliente..."
              value={clientForm.notes}
              onChange={(e) => setClientForm({...clientForm, notes: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Información de la Mascota */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-green-600" />
            Primera Mascota
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="petName">Nombre de la Mascota *</Label>
              <Input
                id="petName"
                type="text"
                placeholder="Rocky"
                value={petForm.name}
                onChange={(e) => setPetForm({...petForm, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Especie *</Label>
              <Select value={petForm.species} onValueChange={(value) => setPetForm({...petForm, species: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la especie" />
                </SelectTrigger>
                <SelectContent>
                  {speciesOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                type="text"
                placeholder="Golden Retriever"
                value={petForm.breed}
                onChange={(e) => setPetForm({...petForm, breed: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Sexo</Label>
              <Select value={petForm.gender} onValueChange={(value) => setPetForm({...petForm, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el sexo" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad (años)</Label>
              <Input
                id="age"
                type="number"
                placeholder="3"
                min="0"
                max="50"
                value={petForm.age}
                onChange={(e) => setPetForm({...petForm, age: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="weight"
                  type="number"
                  placeholder="25.5"
                  step="0.1"
                  min="0"
                  className="pl-10"
                  value={petForm.weight}
                  onChange={(e) => setPetForm({...petForm, weight: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="relative">
                <Palette className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="color"
                  type="text"
                  placeholder="Dorado"
                  className="pl-10"
                  value={petForm.color}
                  onChange={(e) => setPetForm({...petForm, color: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="birthDate"
                  type="date"
                  className="pl-10"
                  value={petForm.birthDate}
                  onChange={(e) => setPetForm({...petForm, birthDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip">Microchip</Label>
            <Input
              id="microchip"
              type="text"
              placeholder="123456789012345"
              value={petForm.microchip}
              onChange={(e) => setPetForm({...petForm, microchip: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="petNotes">Notas adicionales</Label>
            <Textarea
              id="petNotes"
              placeholder="Información adicional sobre la mascota, comportamiento, alergias, etc..."
              value={petForm.notes}
              onChange={(e) => setPetForm({...petForm, notes: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="veterinary-gradient text-white flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrar Cliente y Mascota'}
        </Button>
      </div>
    </form>
  )
}
