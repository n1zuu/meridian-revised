from django.db import models

class MenuItem(models.Model):
    """Menu items available in the restaurant"""
    
    CATEGORY_CHOICES = [
        ('entrées', 'Entrées'),
        ('soup', 'Soup'),
        ('salad', 'Salad'),
        ('main', 'Main Course'),
        ('accompaniments', 'Accompaniments'),
        ('dessert', 'Dessert'),
        ('beverage', 'Beverage'),
    ]
    
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    available = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'menu_items'
        ordering = ['category', 'name']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['available']),
        ]
    
    def __str__(self):
        return f"{self.name} - ${self.price}"
    
    @property
    def is_available(self):
        return self.available
