from rest_framework import serializers
from .models import Order, OrderItem
from menu.serializers import MenuItemSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source='menu_item', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_detail', 'quantity', 'price', 'subtotal', 'notes']
        read_only_fields = ['price', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    waiter_name = serializers.CharField(source='waiter.name', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'table_number', 'waiter', 'waiter_name', 'status', 
                  'total', 'notes', 'items', 'created_at', 'updated_at']
        read_only_fields = ['total', 'created_at', 'updated_at']