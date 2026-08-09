from rest_framework import permissions


class IsManager(permissions.BasePermission):
    """
    Allows access only to users with role='manager'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'manager')


class IsWaiter(permissions.BasePermission):
    """
    Allows access only to users with role='waiter'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'waiter')


class IsCashier(permissions.BasePermission):
    """
    Allows access only to users with role='cashier'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'cashier')


class IsWaiterOrManager(permissions.BasePermission):
    """
    Allows access to waiters and managers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('waiter', 'manager')
        )


class IsCashierOrManager(permissions.BasePermission):
    """
    Allows access to cashiers and managers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('cashier', 'manager')
        )