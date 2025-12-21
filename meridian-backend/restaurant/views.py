from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .models import User, MenuItem, Order, OrderItem, Transaction
from .serializers import (
    UserSerializer, MenuItemSerializer, OrderSerializer, 
    CreateOrderSerializer, TransactionSerializer, CreateTransactionSerializer,
    CreateUserSerializer
)
from .permissions import IsManager

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        login(request, user)
        return Response({
            'success': True,
            'user': UserSerializer(user).data
        })
    
    return Response({
        'success': False,
        'message': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'success': True})


@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


# Menu ViewSet
class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        # Allow anyone to list (GET) or retrieve (GET specific item)
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        # Only Managers can create, update, partial_update, destroy, or toggle
        else:
            permission_classes = [IsAuthenticated, IsManager]
            
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = MenuItem.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by availability
        available = self.request.query_params.get('available')
        if available is not None:
            queryset = queryset.filter(available=available.lower() == 'true')
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['patch'])
    def toggle_availability(self, request, pk=None):
        menu_item = self.get_object()
        menu_item.available = not menu_item.available
        menu_item.save()
        return Response(MenuItemSerializer(menu_item).data)


# Order ViewSet
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        queryset = Order.objects.prefetch_related('items__menu_item').all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by waiter
        if self.request.user.role == 'waiter':
            queryset = queryset.filter(waiter=self.request.user)
        
        return queryset
    
    def create(self, request):
        from decimal import Decimal
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create order with initial zeros
        order = Order.objects.create(
            table_number=serializer.validated_data['table_number'],
            waiter=request.user,
            notes=serializer.validated_data.get('notes', ''),
            subtotal=Decimal('0'),
            vat=Decimal('0'),
            service_fee=Decimal('0'),
            total=Decimal('0')
        )
        
        # Create order items
        for item_data in serializer.validated_data['items']:
            menu_item = MenuItem.objects.get(id=item_data['menu_item_id'])
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=item_data['quantity'],
                price_at_time=menu_item.price,
                special_instructions=item_data.get('special_instructions', '')
            )
        
        # Recalculate totals after all items are added
        order.calculate_totals()
        order.refresh_from_db()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Ensure totals are calculated before returning
        instance.calculate_totals()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# Transaction ViewSet
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        queryset = Transaction.objects.all()
        
        # Filter by date range
        from_date = self.request.query_params.get('from_date')
        to_date = self.request.query_params.get('to_date')
        
        if from_date and to_date:
            queryset = queryset.filter(created_at__date__range=[from_date, to_date])
        
        return queryset
    
    def create(self, request):
        serializer = CreateTransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order = Order.objects.get(id=serializer.validated_data['order_id'])
        payment_method = serializer.validated_data['payment_method']
        
        transaction_data = {
            'order': order,
            'cashier': request.user,
            'payment_method': payment_method,
            'amount': order.total
        }
        
        # Add method-specific data
        if payment_method == 'cash':
            amount_received = serializer.validated_data.get('amount_received')
            transaction_data['amount_received'] = amount_received
            transaction_data['change_given'] = amount_received - order.total
        
        elif payment_method == 'card':
            card_number = serializer.validated_data.get('card_number', '')
            transaction_data['card_last_four'] = card_number.replace(' ', '')[-4:]
            transaction_data['cardholder_name'] = serializer.validated_data.get('cardholder_name', '')
        
        elif payment_method in ['gcash', 'paypal']:
            transaction_data['account_identifier'] = serializer.validated_data.get('account_identifier', '')
            transaction_data['account_name'] = serializer.validated_data.get('account_name', '')
        
        # Create transaction
        transaction = Transaction.objects.create(**transaction_data)
        
        # Update order status
        order.status = 'completed'
        order.save()
        
        return Response(
            TransactionSerializer(transaction).data,
            status=status.HTTP_201_CREATED
        )

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    # Secure this endpoint so only Managers can access it
    permission_classes = [IsAuthenticated, IsManager] 
    
    def get_serializer_class(self):
        # Use the special serializer for creating users (POST)
        if self.action == 'create':
            return CreateUserSerializer
        # Use the standard serializer for listing and updating
        return UserSerializer

    # Optional: Prevent managers from deleting themselves accidentally
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user == request.user:
            return Response(
                {"error": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)
