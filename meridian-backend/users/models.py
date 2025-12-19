from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model with role-based access"""
    
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('waiter', 'Waiter'),
        ('cashier', 'Cashier'),
        ('manager', 'Manager'),
    ]
    
    # username, password, email inherited from AbstractUser
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.role})"
    
    @property
    def is_manager(self):
        return self.role == 'manager'
    
    @property
    def is_waiter(self):
        return self.role == 'waiter'
    
    @property
    def is_cashier(self):
        return self.role == 'cashier'
