from rest_framework.permissions import IsAuthenticated, SAFE_METHODS


class ChannelPermission(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS and request.user in obj.server.members.all():
            return True
        return request.user == obj.server.owner
