import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/common/Table'
import api from '@/services/api'
import { toast } from 'sonner'

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${id}/`)
      setInvoice(response.data)
    } catch (error) {
      toast.error('Failed to fetch invoice')
      navigate('/invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    try {
      await api.post(`/invoices/${id}/send/`)
      toast.success('Invoice sent successfully!')
      fetchInvoice() // Refresh status
    } catch (error) {
      toast.error('Failed to send invoice')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoice) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/invoices')}>
            Back to Invoices
          </Button>
          <Button variant="outline" onClick={handleSend}>
            Send Invoice
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Invoice Details</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-medium">Number:</span> {invoice.invoice_number}</p>
                  <p><span className="font-medium">Amount:</span> €{parseFloat(invoice.amount).toFixed(2)}</p>
                  <p><span className="font-medium">Currency:</span> {invoice.currency}</p>
                  <p><span className="font-medium">Issue Date:</span> {new Date(invoice.issue_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Status:</span> <Badge variant={
                    invoice.status === 'paid' ? 'success' :
                    invoice.status === 'sent' ? 'primary' :
                    'warning'
                  }>{invoice.status}</Badge></p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Client Information</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-medium">Name:</span> {invoice.client_name}</p>
                  <p><span className="font-medium">Email:</span> {invoice.client_email}</p>
                </div>
              </div>
              {invoice.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900">Notes</h3>
                  <p className="mt-2 text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Line Items</h3>
            <Table>
              <TableHeader>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{parseFloat(item.quantity).toFixed(2)}</TableCell>
                    <TableCell>€{parseFloat(item.unit_price).toFixed(2)}</TableCell>
                    <TableCell>€{item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan="3" className="text-right font-semibold">Total</TableCell>
                  <TableCell className="font-bold text-lg">€{parseFloat(invoice.amount).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}