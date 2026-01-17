from django.urls import path
from . import views

urlpatterns = [
    path('checkout-session/', views.create_checkout_session, name='checkout_session'),
    path('subscription/', views.get_subscription, name='get_subscription'),
    path('cancel/', views.cancel_subscription, name='cancel_subscription'),
    path('stripe-webhook/', views.stripe_webhook, name='stripe_webhook'),
]
