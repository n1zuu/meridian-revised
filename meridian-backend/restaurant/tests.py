from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import User


class PermissionTests(TestCase):
    """Verify the role-based access control added during security hardening."""

    def setUp(self):
        self.client = APIClient()

        self.customer = User.objects.create_user(
            username='customer1', password='pass123', role='customer'
        )
        self.waiter = User.objects.create_user(
            username='waiter1', password='pass123', role='waiter'
        )
        self.cashier = User.objects.create_user(
            username='cashier1', password='pass123', role='cashier'
        )
        self.manager = User.objects.create_user(
            username='manager1', password='pass123', role='manager'
        )

    def login(self, user):
        self.client.login(username=user.username, password='pass123')

    # --- Order permissions ---

    def test_customer_cannot_create_order(self):
        """A customer (non-waiter/manager) must be forbidden from creating orders."""
        self.login(self.customer)
        url = reverse('order-list')
        resp = self.client.post(url, {'table_number': 1, 'items': []}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_waiter_can_create_order(self):
        """A waiter is allowed to create an order (permission check only)."""
        self.login(self.waiter)
        url = reverse('order-list')
        # 400 is expected here because payload is invalid; the point is that it is
        # not blocked by *permission* (403) — permission passes first.
        resp = self.client.post(url, {'table_number': 1}, format='json')
        self.assertIn(resp.status_code, (status.HTTP_400_BAD_REQUEST, status.HTTP_201_CREATED))

    def test_waiter_only_sees_own_orders(self):
        """A waiter's GET /orders/ is scoped to orders they created (no rows yet)."""
        self.login(self.waiter)
        url = reverse('order-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [])

    # --- Transaction permissions ---

    def test_waiter_cannot_access_transactions(self):
        """Waiters must not be able to read payment/transaction records."""
        self.login(self.waiter)
        url = reverse('transaction-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_cashier_can_access_transactions(self):
        """Cashiers are allowed to read transactions."""
        self.login(self.cashier)
        url = reverse('transaction-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_manager_can_access_transactions(self):
        """Managers are allowed to read transactions."""
        self.login(self.manager)
        url = reverse('transaction-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # --- Login behavior ---

    def test_login_with_invalid_credentials(self):
        url = reverse('login')
        resp = self.client.post(url, {'username': 'nobody', 'password': 'wrong'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_with_valid_credentials(self):
        url = reverse('login')
        resp = self.client.post(url, {'username': 'manager1', 'password': 'pass123'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data['success'])
        self.assertEqual(resp.data['user']['role'], 'manager')
