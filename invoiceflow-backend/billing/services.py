import stripe
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeService:
    @staticmethod
    def create_customer(user):
        """Criar customer no Stripe"""
        customer = stripe.Customer.create(
            email=user.email,
            name=f"{user.first_name} {user.last_name}",
            metadata={'user_id': user.id}
        )
        return customer.id
    
    @staticmethod
    def create_checkout_session(user, plan):
        """Criar sessão checkout para subscription"""
        subscription = user.subscription
        
        if not subscription.stripe_customer_id:
            subscription.stripe_customer_id = StripeService.create_customer(user)
            subscription.save()
        
        session = stripe.checkout.Session.create(
            customer=subscription.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': plan.stripe_price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url='http://localhost:5173/billing?success=true',
            cancel_url='http://localhost:5173/billing?cancelled=true',
        )
        return session
    
    @staticmethod
    def handle_subscription_updated(event):
        """Webhook: subscription.updated"""
        subscription_data = event['data']['object']
        stripe_sub_id = subscription_data['id']
        stripe_customer_id = subscription_data['customer']
        
        subscription = Subscription.objects.get(
            stripe_subscription_id=stripe_sub_id
        )
        
        # Update status
        status_map = {
            'active': 'active',
            'past_due': 'past_due',
            'canceled': 'cancelled',
        }
        subscription.status = status_map.get(subscription_data['status'], 'active')
        subscription.current_period_start = timezone.datetime.fromtimestamp(
            subscription_data['current_period_start']
        )
        subscription.current_period_end = timezone.datetime.fromtimestamp(
            subscription_data['current_period_end']
        )
        subscription.save()
    
    @staticmethod
    def handle_customer_subscription_created(event):
        """Webhook: customer.subscription.created"""
        subscription_data = event['data']['object']
        stripe_customer_id = subscription_data['customer']
        
        # Get user by stripe_customer_id
        from users.models import UserProfile
        user_profile = UserProfile.objects.get(stripe_customer_id=stripe_customer_id)
        
        # Get plan by stripe_price_id
        plan = Plan.objects.get(stripe_price_id=subscription_data['items']['data'][0]['price']['id'])
        
        # Update subscription
        subscription = user_profile.user.subscription
        subscription.plan = plan
        subscription.stripe_subscription_id = subscription_data['id']
        subscription.status = 'active'
        subscription.current_period_start = timezone.datetime.fromtimestamp(
            subscription_data['current_period_start']
        )
        subscription.current_period_end = timezone.datetime.fromtimestamp(
            subscription_data['current_period_end']
        )
        subscription.save()