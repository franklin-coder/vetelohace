
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, PawPrint, Calendar, FileText, Plus, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSafeDate } from '@/hooks/use-safe-date'

interface DashboardStats {
  totalClients: number
  totalPets: number
  todayConsultations: number
  pendingReports: number
  recentClients: any[]
  recentConsultations: any[]
}

interface DashboardContentProps {
  stats: DashboardStats
  user: any
}

export function DashboardContent({ stats, user }: DashboardContentProps) {
  const { formatDate } = useSafeDate()
  
  const statCards = [
    {
      title: 'Clientes Totales',
      value: stats.totalClients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/dashboard/clients'
    },
    {
      title: 'Mascotas Activas',
      value: stats.totalPets,
      icon: PawPrint,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/dashboard/pets'
    },
    {
      title: 'Consultas Hoy',
      value: stats.todayConsultations,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/dashboard/calendar'
    },
    {
      title: 'Reportes Pendientes',
      value: stats.pendingReports,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/dashboard/reports'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Saludo y acciones rápidas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user?.name?.split(' ')[0] || 'Doctor'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Aquí tienes el resumen de tu práctica veterinaria de hoy
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/dashboard/clients/new">
            <Button className="veterinary-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </Link>
          <Link href="/dashboard/clients">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar Cliente
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.bgColor} rounded-full p-3`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Clientes Recientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Clientes Recientes</CardTitle>
            <Link href="/dashboard/clients">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentClients?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No hay clientes registrados aún</p>
                <Link href="/dashboard/clients/new">
                  <Button className="mt-3" size="sm">
                    Agregar Primer Cliente
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentClients?.slice(0, 5).map((client: any) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{client.fullName}</p>
                      <p className="text-sm text-gray-600">{client.phone}</p>
                      <div className="flex gap-1 mt-1">
                        {client.pets?.slice(0, 3).map((pet: any) => (
                          <Badge key={pet.id} variant="secondary" className="text-xs">
                            {pet.name}
                          </Badge>
                        ))}
                        {client.pets?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{client.pets.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/clients/${client.id}`}>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consultas Recientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Consultas Recientes</CardTitle>
            <Link href="/dashboard/reports">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentConsultations?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No hay consultas registradas aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentConsultations?.slice(0, 5).map((consultation: any) => (
                  <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{consultation.pet?.name}</p>
                      <p className="text-sm text-gray-600">
                        {consultation.pet?.species} • {consultation.veterinarian?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(consultation.visitDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {consultation.reason?.substring(0, 20)}...
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/clients/new">
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Registrar Cliente</h3>
                <p className="text-sm text-gray-600">Agrega un nuevo cliente y su mascota</p>
              </div>
            </Link>

            <Link href="/dashboard/pets/new">
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <PawPrint className="h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Nueva Mascota</h3>
                <p className="text-sm text-gray-600">Registra una mascota para un cliente existente</p>
              </div>
            </Link>

            <Link href="/dashboard/reports">
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Ver Reportes</h3>
                <p className="text-sm text-gray-600">Revisa y gestiona reportes pendientes</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
