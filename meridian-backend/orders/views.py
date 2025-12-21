# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Transaction, Order

@api_view(['POST'])
def process_payment(request):
    payment_data = request.data
    method = payment_data.get('method')
    total = payment_data.get('total')
    order_id = payment_data.get('orderId')
    
    # Create transaction based on payment method
    if method == 'cash':
        amount_received = payment_data.get('amountReceived')
        change = float(amount_received) - float(total)
        
        transaction = Transaction.objects.create(
            order_id=order_id,
            payment_method='cash',
            amount=total,
            amount_received=amount_received,
            change=change
        )
    
    elif method == 'card':
        # Store last 4 digits only for security
        card_number = payment_data.get('cardNumber')
        last_four = card_number.replace(' ', '')[-4:]
        
        transaction = Transaction.objects.create(
            order_id=order_id,
            payment_method='card',
            amount=total,
            card_last_four=last_four,
            cardholder=payment_data.get('cardHolder')
        )
    
    elif method in ['gcash', 'paypal']:
        transaction = Transaction.objects.create(
            order_id=order_id,
            payment_method=method,
            amount=total,
            account_identifier=payment_data.get('phoneNumber'),
            account_name=payment_data.get('accountName')
        )
    
    # Update order status
    order = Order.objects.get(id=order_id)
    order.status = 'completed'
    order.save()
    
    return Response({
        'success': True,
        'transaction_id': transaction.id,
        'change': change if method == 'cash' else 0
    })