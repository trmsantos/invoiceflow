from django.shortcuts import render
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from io import BytesIO
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Invoice, InvoiceItem, Client, Payment
from .serializers import InvoiceSerializer, ClientSerializer, PaymentSerializer, InvoiceItemSerializer
from .tasks import send_invoice_email_sync
from django.shortcuts import render
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.units import inch
import logging

logger = logging.getLogger(__name__)


def generate_invoice_pdf(invoice):
    """Gera PDF profissional do invoice"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    
    # Estilos personalizados
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=24, spaceAfter=30, alignment=1)
    heading_style = ParagraphStyle('Heading', parent=styles['Heading1'], fontSize=14, spaceAfter=10)
    normal_style = styles['Normal']
    normal_style.fontSize = 10
    
    story = []
    
    # Cabeçalho com logotipo (placeholder)
    header_table = Table([
        [Paragraph("Your Company Name", styles['Title']), "Invoice"],
        [Paragraph("Address: 123 Main St, City, Country", normal_style), ""],
        [Paragraph("Phone: +123 456 789 | Email: info@company.com", normal_style), ""],
    ], colWidths=[4*inch, 2*inch])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (1, 0), (1, 0), 16),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 20))
    
    # Número da invoice e datas
    invoice_info = Table([
        ["Invoice Number:", invoice.invoice_number, "Issue Date:", invoice.issue_date.strftime('%d/%m/%Y')],
        ["", "", "Due Date:", invoice.due_date.strftime('%d/%m/%Y')],
        ["Status:", invoice.status.title(), "Currency:", invoice.currency],
    ], colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
    invoice_info.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ]))
    story.append(invoice_info)
    story.append(Spacer(1, 20))
    
    # Informações do cliente
    story.append(Paragraph("Bill To:", heading_style))
    client_info = [
        ["Client Name:", invoice.client_name],
        ["Email:", invoice.client_email],
        ["Address:", "Client Address (se disponível)"],  # Adiciona se tiver no modelo
    ]
    client_table = Table(client_info, colWidths=[1.5*inch, 4*inch])
    client_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))
    story.append(client_table)
    story.append(Spacer(1, 20))
    
    # Tabela de itens
    story.append(Paragraph("Invoice Items:", heading_style))
    data = [['Description', 'Qty', 'Unit Price', 'Total']]
    items = invoice.items.all()
    for item in items:
        data.append([
            item.description,
            str(item.quantity),
            f"€{item.unit_price:.2f}",
            f"€{item.subtotal:.2f}"
        ])
    
    if items:
        items_table = Table(data, colWidths=[3*inch, 0.8*inch, 1.2*inch, 1.2*inch])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ]))
        story.append(items_table)
    else:
        story.append(Paragraph("No items.", normal_style))
    
    story.append(Spacer(1, 10))
    
    # Totais
    total_table = Table([
        ["", "", "Subtotal:", f"€{invoice.amount:.2f}"],
        ["", "", "Total:", f"€{invoice.amount:.2f}"],
    ], colWidths=[3*inch, 0.8*inch, 1.2*inch, 1.2*inch])
    total_table.setStyle(TableStyle([
        ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (2, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (2, 0), (-1, -1), 12),
        ('BACKGROUND', (2, -1), (-1, -1), colors.lightblue),
    ]))
    story.append(total_table)
    
    # Notas
    if invoice.notes:
        story.append(Spacer(1, 20))
        story.append(Paragraph("Notes:", heading_style))
        story.append(Paragraph(invoice.notes, normal_style))
    
    # Rodapé
    story.append(Spacer(1, 40))
    story.append(Paragraph("Thank you for your business!", ParagraphStyle('Footer', parent=normal_style, alignment=1, fontSize=10)))
    story.append(Paragraph("Payment terms: Due within 30 days.", ParagraphStyle('Footer', parent=normal_style, alignment=1, fontSize=8)))
    
    doc.build(story)
    buffer.seek(0)
    return buffer

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
        success = send_invoice_email_sync(invoice.id, invoice.client_email)
        
        if success:
            return Response({'status': 'Invoice sent successfully'})
        else:
            return Response({'status': 'Failed to send invoice'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        """Gerar e retornar PDF do invoice"""
        invoice = self.get_object()
        pdf_buffer = generate_invoice_pdf(invoice)
        
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
        return response

class PaymentViewSet(viewsets.ModelViewSet):
    """CRUD para Payments"""
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(invoice__user=self.request.user)