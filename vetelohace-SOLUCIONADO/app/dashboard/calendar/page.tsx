
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus, Users } from "lucide-react"

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las citas y horarios de la clínica
            </p>
          </div>
          
          <Button className="veterinary-gradient text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Citas Hoy</h3>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Próximas</h3>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Esta Semana</h3>
                <p className="text-2xl font-bold text-purple-600">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vista de Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                Sistema de Agenda
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                El sistema de agenda permitirá programar citas, ver horarios disponibles 
                y gestionar el calendario de la clínica veterinaria.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-900">Vista Mensual</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-900">Horarios</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
