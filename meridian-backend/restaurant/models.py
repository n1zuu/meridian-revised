from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('waiter', 'Waiter'),
        ('cashier', 'Cashier'),
        ('manager', 'Manager'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('entrées', 'Entrées'),
        ('soup', 'Soup'),
        ('salad', 'Salad'),
        ('main-courses', 'Main Courses'),
        ('accompaniments', 'Accompaniments'),
        ('dessert', 'Dessert'),
        ('beverages', 'Beverages'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='menu_items/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    table_number = models.IntegerField()
    waiter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - Table {self.table_number}"
    
    def calculate_totals(self):
        """Calculate order totals based on items"""
        from decimal import Decimal
        
        # Calculate subtotal from all order items
        self.subtotal = sum(
            Decimal(str(item.subtotal)) for item in self.items.all()
        )
        
        # Calculate VAT (12%)
        self.vat = self.subtotal * Decimal('0.12')
        
        # Calculate service fee (10%)
        self.service_fee = self.subtotal * Decimal('0.10')
        
        # Calculate total
        self.total = self.subtotal + self.vat + self.service_fee
        
        self.save()
        
        return {
            'subtotal': float(self.subtotal),
            'vat': float(self.vat),
            'service_fee': float(self.service_fee),
            'total': float(self.total)
        }


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    special_instructions = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        from decimal import Decimal
        # Auto-calculate subtotal
        self.subtotal = Decimal(str(self.price_at_time)) * self.quantity
        super().save(*args, **kwargs)
        # Update order totals after saving item
        self.order.calculate_totals()
    
    def delete(self, *args, **kwargs):
        order = self.order
        super().delete(*args, **kwargs)
        # Recalculate order totals after deleting item
        order.calculate_totals()
    
    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

class Transaction(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Credit/Debit Card'),
        ('gcash', 'GCash'),
        ('paypal', 'PayPal'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='transaction')
    cashier = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='transactions')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Cash-specific fields
    amount_received = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    change_given = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Card-specific fields
    card_last_four = models.CharField(max_length=4, blank=True)
    cardholder_name = models.CharField(max_length=200, blank=True)
    
    # E-wallet specific fields
    account_identifier = models.CharField(max_length=200, blank=True)  # Phone/Email
    account_name = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Transaction #{self.id} - Order #{self.order.id}"
