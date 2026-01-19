import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input, Label } from '@/components/common/Input'
import { Alert } from '@/components/common/Alert'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Login component: Attempting login with email:', email) 
    const success = await login(email, password)
    
    console.log('Login component: Login success:', success) 
    
    if (success) {
      console.log('Login component: Redirecting to dashboard') 
      toast.success('Login successful!')
      
      navigate('/dashboard')
    } else {
      console.log('Login component: Login failed, staying on login page') 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <a 
            href="/" 
            className="absolute top-6 left-6 text-blue-600 hover:underline font-semibold"
          >
            ← Back Home
          </a>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">InvoiceFlow</CardTitle>
          <p className="text-center text-gray-600 mt-2">Login to your account</p>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="error" message={error} />}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}