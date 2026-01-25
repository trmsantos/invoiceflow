from django.core.mail import send_mail
from django.conf import settings
from .models import Invoice
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def send_invoice_email_sync(invoice_id, recipient_email):
    """Enviar invoice por email (synchronous)"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        
        subject = f'Invoice {invoice.invoice_number} - InvoiceFlow'
        
        message = f"""
Dear {invoice.client_name},

Your invoice is ready:

Invoice Number: {invoice.invoice_number}
Amount: €{invoice.amount}
Due Date: {invoice.due_date}

Best regards,
InvoiceFlow Team
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        
        invoice.status = 'sent'
        invoice.save()
        
        print(f"✅ Email enviado para {recipient_email}")
        return True
    
    except Exception as e:
        print(f"❌ Erro ao enviar email: {str(e)}")
        return False