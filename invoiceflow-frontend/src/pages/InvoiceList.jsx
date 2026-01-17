import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/common/Table'
import api from '@/services/api'
import { toast } from 'sonner'

export default function InvoiceList() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices/')
      setInvoices(response.data.results || [])
    } catch (error) {
      toast.error('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return
    
    try {
      await api.delete(`/invoices/${id}/`)
      toast.success('Invoice deleted')
      fetchInvoices()
    } catch (error) {
      toast.error('Failed to delete invoice')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button onClick={() => navigate('/invoices/new')}>
          + New Invoice
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No invoices yet. <a href="/invoices/new" className="text-blue-600 hover:underline">Create one</a>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.client_name}</TableCell>
                    <TableCell>€{parseFloat(invoice.amount).toFixed(2)}</TableCell>
                    <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.status === 'paid' ? 'success' :
                        invoice.status === 'sent' ? 'primary' :
                        'warning'
                      }>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}