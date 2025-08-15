
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Plus, Phone, Mail, MapPin, PawPrint, Eye } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSafeDate } from '@/hooks/use-safe-date'

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  age?: number
  photo?: string
}

interface Client {
  id: string
  fullName: string
  phone: string
  email?: string
  address?: string
  identityDocument?: string
  createdAt: string
  pets: Pet[]
  _count: {
    pets: number
  }
}

interface ClientsContentProps {
  clients: Client[]
}

export function ClientsContent({ clients }: ClientsContentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredClients, setFilteredClients] = useState(clients)
  const { isRecentDate } = useSafeDate()

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredClients(clients)
      return
    }

    const filtered = clients.filter(client =>
      client.fullName.toLowerCase().includes(term.toLowerCase()) ||
      client.phone.includes(term) ||
      client.email?.toLowerCase().includes(term.toLowerCase()) ||
      client.pets.some(pet => pet.name.toLowerCase().includes(term.toLowerCase()))
    )
    setFilteredClients(filtered)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todos los clientes y sus mascotas
          </p>
        </div>
        
        <Link href="/dashboard/clients/new">
          <Button className="veterinary-gradient text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, teléfono, email o nombre de mascota..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
              <p className="text-sm text-gray-600">Total Clientes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {clients.reduce((acc, client) => acc + client._count.pets, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Mascotas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {clients.filter(client => isRecentDate(client.createdAt, 30)).length}
              </p>
              <p className="text-sm text-gray-600">Nuevos este mes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de clientes */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otro término de búsqueda' 
                  : 'Comienza agregando tu primer cliente'}
              </p>
              {!searchTerm && (
                <Link href="/dashboard/clients/new">
                  <Button className="veterinary-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Cliente
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-100 text-green-700 text-lg">
                          {client.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {client.fullName}
                          </h3>
                          <Badge variant="outline">
                            {client._count.pets} mascota{client._count.pets !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            {client.phone}
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              {client.email}
                            </div>
                          )}
                          {client.address && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                              <MapPin className="h-4 w-4" />
                              {client.address}
                            </div>
                          )}
                        </div>

                        {client.pets.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Mascotas:</p>
                            <div className="flex flex-wrap gap-2">
                              {client.pets.slice(0, 4).map((pet) => (
                                <div key={pet.id} className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
                                  <span className="text-sm">{getSpeciesIcon(pet.species)}</span>
                                  <span className="text-sm font-medium">{pet.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {getSpeciesName(pet.species)}
                                  </span>
                                </div>
                              ))}
                              {client.pets.length > 4 && (
                                <Badge variant="secondary" className="rounded-full">
                                  +{client.pets.length - 4} más
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/dashboard/clients/${client.id}`}>
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
