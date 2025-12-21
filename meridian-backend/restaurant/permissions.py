from rest_framework import permissions

class IsManager(permissions.BasePermission):
    """
    Allows access only to users with role='manager'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'manager')