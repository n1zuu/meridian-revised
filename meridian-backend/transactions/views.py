# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Transaction

@api_view(['GET'])
def get_transactions(request):
    # Optional date filtering
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    
    transactions = Transaction.objects.all()
    
    if from_date and to_date:
        transactions = transactions.filter(
            date__range=[from_date, to_date]
        )
    
    data = [{
        'id': t.id,
        'amount': float(t.total_amount),
        'method': t.payment_method,
        'date': t.date.strftime('%B %d, %Y'),
        'table': t.table_number,
        'orderId': t.order_id,
        'cashier': t.cashier.full_name,
        'subtotal': float(t.subtotal),
        'vat': float(t.vat),
        'serviceFee': float(t.service_fee)
    } for t in transactions]
    
    return Response(data)
