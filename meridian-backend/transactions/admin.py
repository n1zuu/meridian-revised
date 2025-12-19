from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'cashier', 'amount', 'payment_method', 'created_at']
    list_filter = ['payment_method', 'created_at']
    search_fields = ['id', 'order__id', 'reference_number']
    readonly_fields = ['created_at']
