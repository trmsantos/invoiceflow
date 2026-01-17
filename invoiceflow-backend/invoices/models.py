from django.contrib.auth.models import User
from django.db import models
from decimal import Decimal

class Client(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clients')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=255, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.company})"

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('viewed', 'Viewed'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]
    
    CURRENCY_CHOICES = [
        ('EUR', '€ Euro'),
        ('USD', '$ USD'),
        ('GBP', '£ GBP'),
        ('BRL', 'R$ Real'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    invoice_number = models.CharField(max_length=50)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='EUR')
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'invoice_number')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.client_name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=500)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def subtotal(self):
        return self.quantity * self.unit_price
    
    def __str__(self):
        return f"{self.description} - {self.subtotal}"

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Credit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('other', 'Other'),
    ]
    
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, default='pending')
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment for {self.invoice.invoice_number}"