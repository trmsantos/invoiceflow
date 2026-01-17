from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import stripe

from .models import Plan, Subscription
from .services import StripeService

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """Criar sessão de checkout"""
    plan_name = request.data.get('plan')
    
    try:
        plan = Plan.objects.get(name=plan_name)
        session = StripeService.create_checkout_session(request.user, plan)
        return Response({
            'sessionId': session.id,
            'url': session.url,
        })
    except Plan.DoesNotExist:
        return Response({'error': 'Plan not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_subscription(request):
    """Get informações da subscription atual"""
    subscription = request.user.subscription
    
    if not subscription or not subscription.plan:
        return Response({
            'plan': 'free',
            'status': 'inactive',
            'current_period_end': None,
        })
    
    return Response({
        'plan': subscription.plan.name,
        'status': subscription.status,
        'current_period_start': subscription.current_period_start,
        'current_period_end': subscription.current_period_end,
        'features': subscription.plan.features,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    """Cancelar subscription"""
    subscription = request.user.subscription
    
    if not subscription.stripe_subscription_id:
        return Response({'error': 'No active subscription'}, status=400)
    
    try:
        stripe.Subscription.delete(subscription.stripe_subscription_id)
        subscription.status = 'cancelled'
        subscription.save()
        return Response({'message': 'Subscription cancelled'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    """Handle Stripe webhooks"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    
    # Handle event
    if event['type'] == 'customer.subscription.created':
        StripeService.handle_customer_subscription_created(event)
    elif event['type'] == 'customer.subscription.updated':
        StripeService.handle_subscription_updated(event)
    
    return JsonResponse({'status': 'success'})