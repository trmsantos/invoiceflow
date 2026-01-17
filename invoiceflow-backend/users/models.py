from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    SUBSCRIPTION_TIERS = [
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('enterprise', 'Enterprise'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    subscription_tier = models.CharField(
        max_length=20, 
        choices=SUBSCRIPTION_TIERS, 
        default='free'
    )
    stripe_customer_id = models.CharField(max_length=255, blank=True)
    invoices_created_this_month = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.subscription_tier}"

    class Meta:
        verbose_name_plural = "User Profiles"