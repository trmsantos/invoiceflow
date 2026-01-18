from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Invoice, InvoiceItem, Client, Payment
from .serializers import InvoiceSerializer, ClientSerializer, PaymentSerializer, InvoiceItemSerializer
from .tasks import send_invoice_email_sync  # ← Muda isto

class ClientViewSet(viewsets.ModelViewSet):
    """CRUD para Clientes"""
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class InvoiceViewSet(viewsets.ModelViewSet):
    """CRUD para Invoices"""
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user).prefetch_related('items')
    
    def create(self, request, *args, **kwargs):
        """Criar invoice com items"""
        data = request.data.copy()
        items_data = data.pop('items', [])
        
        invoice_serializer = self.get_serializer(data=data)
        invoice_serializer.is_valid(raise_exception=True)
        invoice = invoice_serializer.save(user=request.user)
        
        # Criar items
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        
        return Response(
            InvoiceSerializer(invoice).data,
            status=status.HTTP_201_CREATED
        )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """Enviar invoice por email"""
        invoice = self.get_object()
        
        # Enviar email synchronously
        send_invoice_email_sync(invoice.id, invoice.client_email)
        
        return Response({'status': 'Invoice sent successfully'})

class PaymentViewSet(viewsets.ModelViewSet):
    """CRUD para Payments"""
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(invoice__user=self.request.user)