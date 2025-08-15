
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"
import { Stethoscope, Heart, Users, FileText, Mic } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="veterinary-gradient rounded-full p-2">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VeteLoHace</h1>
                <p className="text-sm text-gray-600">Sistema Veterinario Inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Lado izquierdo - Información */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Reduce el tiempo de documentación veterinaria de{" "}
                <span className="text-red-500">40 minutos</span> a{" "}
                <span className="text-green-600">5 minutos</span>
              </h2>
              <p className="text-xl text-gray-600">
                Transcripción automática con IA, reportes inteligentes y gestión completa 
                de clientes y mascotas en una sola plataforma.
              </p>
            </div>

            {/* Características */}
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-green-100 rounded-lg p-2">
                  <Mic className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Transcripción Automática</h3>
                  <p className="text-gray-600">Whisper AI convierte tu voz en texto al instante</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-blue-100 rounded-lg p-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reportes Inteligentes</h3>
                  <p className="text-gray-600">Templates específicos para cada especie animal</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gestión Completa</h3>
                  <p className="text-gray-600">Clientes, mascotas e historia clínica centralizada</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="bg-red-100 rounded-lg p-2">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hecho para Sudamérica</h3>
                  <p className="text-gray-600">Diseñado específicamente para veterinarios latinos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado derecho - Formulario de login */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Inicia Sesión</h3>
              <p className="text-gray-600 mt-2">Accede a tu práctica veterinaria</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  )
}
