from rest_framework import serializers
from .models import User, MenuItem, Order, OrderItem, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number']
        read_only_fields = ['id']


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'category', 'available', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    menu_item_category = serializers.CharField(source='menu_item.category', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'menu_item_category', 
                  'quantity', 'price_at_time', 'subtotal', 'special_instructions']
        read_only_fields = ['id', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    waiter_name = serializers.CharField(source='waiter.get_full_name', read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    # Add these computed fields to ensure totals are always calculated
    calculated_subtotal = serializers.SerializerMethodField()
    calculated_vat = serializers.SerializerMethodField()
    calculated_service_fee = serializers.SerializerMethodField()
    calculated_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'table_number', 'waiter', 'waiter_name', 'status', 
                  'subtotal', 'vat', 'service_fee', 'total', 
                  'calculated_subtotal', 'calculated_vat', 'calculated_service_fee', 'calculated_total',
                  'notes', 'items', 'created_at', 'time_ago']
        read_only_fields = ['id', 'created_at']
    
    def get_calculated_subtotal(self, obj):
        from decimal import Decimal
        total = sum(Decimal(str(item.subtotal)) for item in obj.items.all())
        return float(total)
    
    def get_calculated_vat(self, obj):
        from decimal import Decimal
        subtotal = sum(Decimal(str(item.subtotal)) for item in obj.items.all())
        return float(subtotal * Decimal('0.12'))
    
    def get_calculated_service_fee(self, obj):
        from decimal import Decimal
        subtotal = sum(Decimal(str(item.subtotal)) for item in obj.items.all())
        return float(subtotal * Decimal('0.10'))
    
    def get_calculated_total(self, obj):
        from decimal import Decimal
        subtotal = sum(Decimal(str(item.subtotal)) for item in obj.items.all())
        vat = subtotal * Decimal('0.12')
        service_fee = subtotal * Decimal('0.10')
        return float(subtotal + vat + service_fee)
    
    def get_time_ago(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff < timedelta(minutes=1):
            return "just now"
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f"{minutes} min"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} hour"
        else:
            days = diff.days
            return f"{days} day"


class CreateOrderSerializer(serializers.Serializer):
    table_number = serializers.IntegerField()
    items = serializers.ListField(
        child=serializers.DictField()
    )
    notes = serializers.CharField(required=False, allow_blank=True)


class TransactionSerializer(serializers.ModelSerializer):
    order_id_display = serializers.CharField(source='order.id', read_only=True)
    table_number = serializers.IntegerField(source='order.table_number', read_only=True)
    cashier_name = serializers.CharField(source='cashier.get_full_name', read_only=True)
    date = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = ['id', 'order', 'order_id_display', 'table_number', 'cashier', 
                  'cashier_name', 'payment_method', 'amount', 'amount_received', 
                  'change_given', 'card_last_four', 'cardholder_name', 
                  'account_identifier', 'account_name', 'created_at', 'date']
        read_only_fields = ['id', 'created_at']
    
    def get_date(self, obj):
        return obj.created_at.strftime('%B %d, %Y')


class CreateTransactionSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Transaction.PAYMENT_METHOD_CHOICES)

    amount = serializers.DecimalField(max_digits=10, decimal_places=2) 
    
    # Cash fields
    amount_received = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    
    # Card fields
    card_number = serializers.CharField(required=False)
    cardholder_name = serializers.CharField(required=False)
    
    # E-wallet fields
    account_identifier = serializers.CharField(required=False)
    account_name = serializers.CharField(required=False)

class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'role', 'phone_number']

    def create(self, validated_data):
        # Use create_user to correctly hash the password
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'waiter'),
            phone_number=validated_data.get('phone_number', '')
        )
        return user