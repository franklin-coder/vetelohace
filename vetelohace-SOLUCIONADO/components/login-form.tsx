
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, FileText } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    phone: '',
    address: '',
    licenseNumber: '',
    clinicName: '',
    clinicAddress: '',
    clinicPhone: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: loginForm.email,
        password: loginForm.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Credenciales incorrectas')
      } else {
        toast.success('¡Bienvenido!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (!registerForm.userType) {
      toast.error('Selecciona el tipo de perfil')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('¡Registro exitoso! Iniciando sesión...')
        
        // Auto-login después del registro
        const result = await signIn('credentials', {
          email: registerForm.email,
          password: registerForm.password,
          redirect: false,
        })

        if (result?.error) {
          toast.error('Error al iniciar sesión automática')
        } else {
          router.push('/dashboard')
        }
      } else {
        toast.error(data.message || 'Error al registrarse')
      }
    } catch (error) {
      toast.error('Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
        <TabsTrigger value="register">Registrarse</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full veterinary-gradient text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="register">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Dr. Juan Pérez"
                      className="pl-10"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Perfil</Label>
                <Select value={registerForm.userType} onValueChange={(value) => setRegisterForm({...registerForm, userType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VETERINARIAN">Veterinario Individual</SelectItem>
                    <SelectItem value="CLINIC_OWNER">Propietario de Clínica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+57 300 123 4567"
                      className="pl-10"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Número de Licencia</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="licenseNumber"
                      type="text"
                      placeholder="LIC-12345"
                      className="pl-10"
                      value={registerForm.licenseNumber}
                      onChange={(e) => setRegisterForm({...registerForm, licenseNumber: e.target.value})}
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
                    placeholder="Calle 123 #45-67, Ciudad"
                    className="pl-10"
                    value={registerForm.address}
                    onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})}
                  />
                </div>
              </div>

              {registerForm.userType === 'CLINIC_OWNER' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Nombre de la Clínica</Label>
                    <Input
                      id="clinicName"
                      type="text"
                      placeholder="Clínica Veterinaria San Martín"
                      value={registerForm.clinicName}
                      onChange={(e) => setRegisterForm({...registerForm, clinicName: e.target.value})}
                      required={registerForm.userType === 'CLINIC_OWNER'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicAddress">Dirección de la Clínica</Label>
                      <Input
                        id="clinicAddress"
                        type="text"
                        placeholder="Av. Principal #123"
                        value={registerForm.clinicAddress}
                        onChange={(e) => setRegisterForm({...registerForm, clinicAddress: e.target.value})}
                        required={registerForm.userType === 'CLINIC_OWNER'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clinicPhone">Teléfono de la Clínica</Label>
                      <Input
                        id="clinicPhone"
                        type="tel"
                        placeholder="+57 1 234 5678"
                        value={registerForm.clinicPhone}
                        onChange={(e) => setRegisterForm({...registerForm, clinicPhone: e.target.value})}
                        required={registerForm.userType === 'CLINIC_OWNER'}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full veterinary-gradient text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
