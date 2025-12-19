from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    cashier_name = serializers.CharField(source='cashier.name', read_only=True)
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'order', 'order_id', 'cashier', 'cashier_name', 
                  'amount', 'payment_method', 'reference_number', 'created_at']
        read_only_fields = ['created_at']