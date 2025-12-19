from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    readonly_fields = ['subtotal']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'table_number', 'waiter', 'status', 'total', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['id', 'table_number']
    inlines = [OrderItemInline]
    readonly_fields = ['total', 'created_at', 'updated_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'menu_item', 'quantity', 'price', 'subtotal']
    readonly_fields = ['subtotal']