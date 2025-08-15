
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NewClientForm } from "@/components/new-client-form"

export default async function NewClientPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
          <p className="text-gray-600 mt-1">
            Registra un nuevo cliente y su primera mascota
          </p>
        </div>
        
        <NewClientForm />
      </div>
    </DashboardLayout>
  )
}
