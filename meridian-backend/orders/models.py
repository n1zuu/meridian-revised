from django.db import models
from django.conf import settings
from menu.models import MenuItem

class Order(models.Model):
    """Customer orders managed by waiters"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    table_number = models.IntegerField()
    waiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['table_number']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Order #{self.id} - Table {self.table_number}"
    
    def calculate_total(self):
        """Calculate total from order items"""
        total = sum(item.subtotal for item in self.items.all())
        self.total = total
        self.save()
        return total
    
    @property
    def is_active(self):
        return self.status not in ['completed', 'cancelled']


class OrderItem(models.Model):
    """Individual items in an order"""
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.PROTECT,
        related_name='order_items'
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'order_items'
    
    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"
    
    @property
    def subtotal(self):
        return self.price * self.quantity
    
    def save(self, *args, **kwargs):
        # Auto-set price from menu item if not provided
        if not self.price:
            self.price = self.menu_item.price
        super().save(*args, **kwargs)