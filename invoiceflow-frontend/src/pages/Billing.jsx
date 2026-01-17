import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { Badge } from '@/components/common/Badge'
import api from '@/services/api'
import { toast } from 'sonner'

const PLANS = [
  {
    name: 'free',
    title: 'Free',
    price: '€0',
    period: 'forever',
    invoices: '5 invoices/month',
    features: ['Basic invoice creation', 'Email delivery', '1 user'],
  },
  {
    name: 'pro',
    title: 'Pro',
    price: '€9',
    period: '/month',
    invoices: 'Unlimited invoices',
    features: ['Everything in Free', 'Payment tracking', 'Recurring invoices', '3 users'],
    popular: true,
  },
  {
    name: 'enterprise',
    title: 'Enterprise',
    price: '€49',
    period: '/month',
    invoices: 'Unlimited everything',
    features: ['Everything in Pro', 'API access', 'Custom branding', 'Priority support'],
  },
]

export default function Billing() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/billing/subscription/')
      setSubscription(response.data)
    } catch (error) {
      toast.error('Failed to fetch subscription info')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planName) => {
    try {
      const response = await api.post('/billing/checkout-session/', {
        plan: planName,
      })
      window.location.href = response.data.url
    } catch (error) {
      toast.error('Failed to create checkout session')
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel subscription? You will lose access to premium features.')) return
    
    try {
      await api.post('/billing/cancel/')
      toast.success('Subscription cancelled')
      fetchSubscription()
    } catch (error) {
      toast.error('Failed to cancel subscription')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Billing Plans</h1>

      {subscription && subscription.status === 'active' && (
        <Alert variant="success" title="Active Plan" message={`You are on the ${subscription.plan} plan`} />
      )}

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {PLANS.map(plan => (
          <Card key={plan.name} className={plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.title}
                {plan.popular && <Badge variant="primary">Popular</Badge>}
              </CardTitle>
              <div className="text-3xl font-bold text-gray-900 mt-4">
                {plan.price} <span className="text-lg text-gray-600">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{plan.invoices}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 bg-blue-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {subscription?.plan === plan.name ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                >
                  {plan.name === 'free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {subscription?.status === 'active' && (
        <div className="mt-12 text-center">
          <Button variant="danger" onClick={handleCancel}>
            Cancel Subscription
          </Button>
        </div>
      )}
    </div>
  )
}