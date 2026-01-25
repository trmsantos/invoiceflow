import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/common/Table'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu' // Import direto do Radix
import { MoreHorizontal, Trash2, FileText, Send } from 'lucide-react' // Removido Eye, não usado
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
      fetchInvoice()
    } catch (error) {
      toast.error('Failed to send invoice')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return
    try {
      await api.delete(`/invoices/${id}/`)
      toast.success('Invoice deleted successfully!')
      navigate('/invoices')
    } catch (error) {
      toast.error('Failed to delete invoice')
    }
  }

  const handleDownloadPDF = async () => {
    const response = await api.get(`/invoices/${id}/pdf/`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice_${invoice.invoice_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Professional Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoice {invoice.invoice_number}</h1>
            <div className="flex items-center gap-4">
              <Badge variant={
                invoice.status === 'paid' ? 'success' :
                invoice.status === 'sent' ? 'primary' :
                'warning'
              } className="text-sm">
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
              <span className="text-gray-600">Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/invoices')}>
              Back to Invoices
            </Button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end" className="bg-white border border-gray-200 rounded-md shadow-lg p-1">
                <DropdownMenu.Item onClick={handleDownloadPDF} className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={handleSend} className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={handleDelete} className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Invoice
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Invoice Number:</span>
                <span>{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Issue Date:</span>
                <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Due Date:</span>
                <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Currency:</span>
                <span>{invoice.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Name:</span>
                <span>{invoice.client_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span>{invoice.client_email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.quantity).toFixed(2)}</TableCell>
                  <TableCell className="text-right">€{parseFloat(item.unit_price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">€{item.subtotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2">
                <TableCell colSpan="3" className="text-right font-semibold">Total Amount</TableCell>
                <TableCell className="text-right font-bold text-xl text-blue-600">€{parseFloat(invoice.amount).toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}