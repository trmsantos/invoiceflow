import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input, Label, Select } from '@/components/common/Input'
import { toast } from 'sonner'
import api from '@/services/api'

export default function InvoiceCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    invoice_number: `INV-${Date.now()}`,
    client_name: '',
    client_email: '',
    amount: '',
    currency: 'EUR',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  })

  const [items, setItems] = useState([
    { description: '', quantity: 1, unit_price: '' }
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: '' }])
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        amount: items.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)), 0),
        items: items.filter(item => item.description && item.unit_price),
      }

      const response = await api.post('/invoices/', payload)
      toast.success('Invoice created successfully!')
      navigate('/invoices')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  const total = items.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)), 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create Invoice</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Invoice Number</Label>
                <Input
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  options={[
                    { value: 'EUR', label: '€ Euro' },
                    { value: 'USD', label: '$ USD' },
                    { value: 'GBP', label: '£ GBP' },
                  ]}
                />
              </div>
            </div>

            {/* Client Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Client Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Client Name</Label>
                  <Input
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>Client Email</Label>
                  <Input
                    type="email"
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <h3 className="font-semibold">Line Items</h3>
              {items.map((item, index) => (
                <div key={index} className="grid md:grid-cols-12 gap-2 items-end">
                  <div className="md:col-span-6">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="e.g., Consulting Services"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
              >
                + Add Item
              </Button>
            </div>

            {/* Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-right">
                <p className="text-gray-600">Total</p>
                <p className="text-3xl font-bold text-blue-600">€{total.toFixed(2)}</p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes</Label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Additional notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/invoices')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}