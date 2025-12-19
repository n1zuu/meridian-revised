from django.db import models
from django.conf import settings
from orders.models import Order

class Transaction(models.Model):
    """Payment transactions processed by cashiers"""
    
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('gcash', 'GCash'),
        ('paymaya', 'PayMaya'),
    ]
    
    order = models.OneToOneField(
        Order,
        on_delete=models.PROTECT,
        related_name='transaction'
    )
    cashier = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='transactions'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='cash'
    )
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['payment_method']),
        ]
    
    def __str__(self):
        return f"Transaction #{self.id} - Order #{self.order.id}"
    
    def save(self, *args, **kwargs):
        # Auto-set amount from order if not provided
        if not self.amount:
            self.amount = self.order.total
        super().save(*args, **kwargs)