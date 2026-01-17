import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import api from '@/services/api'
import { toast } from 'sonner'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const invoices = await api.get('/invoices/')
      const results = invoices.data.results || []
      
      setStats({
        totalInvoices: invoices.data.count || 0,
        pendingInvoices: results.filter(i => i.status === 'sent' || i.status === 'viewed').length,
        paidInvoices: results.filter(i => i.status === 'paid').length,
        totalRevenue: results.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0),
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your invoicing summary.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-6">
            <div className="text-sm text-gray-600 font-semibold">Total Invoices</div>
            <div className="text-4xl font-black text-blue-600 mt-3">{stats?.totalInvoices || 0}</div>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="text-sm text-gray-600 font-semibold">Pending</div>
            <div className="text-4xl font-black text-yellow-600 mt-3">{stats?.pendingInvoices || 0}</div>
            <p className="text-xs text-gray-500 mt-2">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="text-sm text-gray-600 font-semibold">Paid</div>
            <div className="text-4xl font-black text-green-600 mt-3">{stats?.paidInvoices || 0}</div>
            <p className="text-xs text-gray-500 mt-2">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="text-sm text-gray-600 font-semibold">Total Revenue</div>
            <div className="text-4xl font-black text-blue-600 mt-3">€{(stats?.totalRevenue || 0).toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-2">Received</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Start managing your invoices now with our powerful tools.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="/invoices" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              View Invoices
            </a>
            <a href="/invoices/new" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
              Create Invoice
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}