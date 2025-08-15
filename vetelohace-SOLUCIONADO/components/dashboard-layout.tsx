
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Stethoscope, 
  Users, 
  PawPrint, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    title: 'Clientes',
    href: '/dashboard/clients',
    icon: Users
  },
  {
    title: 'Mascotas',
    href: '/dashboard/pets',
    icon: PawPrint
  },
  {
    title: 'Reportes',
    href: '/dashboard/reports',
    icon: FileText
  },
  {
    title: 'Agenda',
    href: '/dashboard/calendar',
    icon: Calendar
  }
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="veterinary-gradient rounded-full p-2">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">VeteLoHace</h1>
            <p className="text-xs text-gray-600">{session?.user?.userType === 'CLINIC_OWNER' ? 'Clínica' : 'Veterinario'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User info and logout at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-100 text-green-700">
                {session?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {session?.user?.email || ''}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {sidebarItems.find(item => item.href === pathname)?.title || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-600">
                  Bienvenido, {session?.user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar close button */}
      {sidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 right-4 z-50 lg:hidden bg-white shadow-md"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
