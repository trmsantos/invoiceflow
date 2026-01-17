import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
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
      setStats({
        totalInvoices: invoices.data.count || 0,
        pendingInvoices: invoices.data.results?.filter(i => i.status === 'sent' || i.status === 'viewed').length || 0,
        paidInvoices: invoices.data.results?.filter(i => i.status === 'paid').length || 0,
        totalRevenue: invoices.data.results?.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0) || 0,
      })
    } catch (error) {
      toast.error('Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">Total Invoices</div>
            <div className="text-3xl font-bold mt-2">{stats?.totalInvoices || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pendingInvoices || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">Paid</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats?.paidInvoices || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">€{(stats?.totalRevenue || 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to InvoiceFlow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Create professional invoices in seconds and track payments automatically.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="/invoices" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Invoices
            </a>
            <a href="/invoices/new" className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
              Create Invoice
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}