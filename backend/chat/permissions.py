from rest_framework.permissions import IsAuthenticated, SAFE_METHODS


class MessagePermission(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user == obj.sender