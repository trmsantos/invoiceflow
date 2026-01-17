import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input, Label } from '@/components/common/Input'
import { Alert } from '@/components/common/Alert'
import { toast } from 'sonner'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    )
    if (success) {
      toast.success('Account created! Redirecting...')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
          <p className="text-center text-gray-600 mt-2">Join InvoiceFlow</p>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="error" message={error} />}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="João"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Silva"
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}