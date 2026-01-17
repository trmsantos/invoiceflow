from django.db import models
from django.contrib.auth.models import User

class Plan(models.Model):
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('pro', 'Pro - €9/month'),
        ('enterprise', 'Enterprise - €49/month'),
    ]
    
    name = models.CharField(max_length=50, choices=PLAN_CHOICES, unique=True)
    price_monthly = models.DecimalField(max_digits=6, decimal_places=2)  # Em cents
    invoices_per_month = models.IntegerField()  # -1 = unlimited
    features = models.JSONField(default=dict)  # {create_invoice, team_users, custom_branding}
    stripe_price_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('past_due', 'Past Due'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    stripe_subscription_id = models.CharField(max_length=255, blank=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True)
    current_period_start = models.DateTimeField(null=True)
    current_period_end = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"
    
    @property
    def is_active(self):
        return self.status == 'active'