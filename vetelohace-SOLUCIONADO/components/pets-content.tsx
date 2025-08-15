'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus, Phone, Mail, MapPin, PawPrint, Eye, User } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSafeDate } from '@/hooks/use-safe-date'

interface Owner {
  id: string
  fullName: string
  phone: string
  email?: string
  address?: string
}

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  age?: number
  photo?: string
  createdAt: string
  owner: Owner
}

interface PetsContentProps {
  pets: Pet[]
}

export function PetsContent({ pets }: PetsContentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPets, setFilteredPets] = useState(pets)
  const { isRecentDate } = useSafeDate()

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredPets(pets)
      return
    }

    const filtered = pets.filter(pet =>
      pet.name.toLowerCase().includes(term.toLowerCase()) ||
      pet.species.toLowerCase().includes(term.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(term.toLowerCase()) ||
      pet.owner.fullName.toLowerCase().includes(term.toLowerCase()) ||
      pet.owner.phone.includes(term) ||
      pet.owner.email?.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredPets(filtered)
  }

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

  const getSpeciesCount = (species: string) => {
    return pets.filter(pet => pet.species === species).length
  }

  const uniqueSpecies = [...new Set(pets.map(pet => pet.species))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mascotas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todas las mascotas de la clínica
          </p>
        </div>
        
        <Link href="/dashboard/pets/new">
          <Button className="veterinary-gradient text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Mascota
          </Button>
        </Link>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre de mascota, especie, raza o dueño..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{pets.length}</p>
              <p className="text-sm text-gray-600">Total Mascotas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {[...new Set(pets.map(pet => pet.owner.id))].length}
              </p>
              <p className="text-sm text-gray-600">Dueños Únicos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {pets.filter(pet => isRecentDate(pet.createdAt, 30)).length}
              </p>
              <p className="text-sm text-gray-600">Nuevas este mes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {uniqueSpecies.length}
              </p>
              <p className="text-sm text-gray-600">Especies Distintas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de mascotas */}
      {filteredPets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron mascotas' : 'No hay mascotas registradas'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otro término de búsqueda' 
                  : 'Comienza agregando la primera mascota'}
              </p>
              {!searchTerm && (
                <Link href="/dashboard/pets/new">
                  <Button className="veterinary-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primera Mascota
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                          {getSpeciesIcon(pet.species)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pet.name}
                          </h3>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {getSpeciesName(pet.species)}
                          </Badge>
                          {pet.age && (
                            <Badge variant="secondary">
                              {pet.age} año{pet.age !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        {pet.breed && (
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Raza:</strong> {pet.breed}
                          </p>
                        )}

                        {/* Información del dueño */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Dueño:</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">{pet.owner.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              {pet.owner.phone}
                            </div>
                            {pet.owner.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                                <Mail className="h-3 w-3" />
                                {pet.owner.email}
                              </div>
                            )}
                            {pet.owner.address && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                                <MapPin className="h-3 w-3" />
                                {pet.owner.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/dashboard/pets/${pet.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}