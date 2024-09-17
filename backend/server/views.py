from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from server.models import Server
from server.serializers import (
    ServerSerializer,
    ServerActionSerializer,
    ServerMemberActionSerializer,
)
from server.schema import list_server_docs
from server.permissions import ServerPermission
from server.mixins import AdditionalMixins
from rest_framework.decorators import action


class ServerViewSet(ModelViewSet, AdditionalMixins):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    permission_classes = [ServerPermission]

    def get_queryset(self):
        request = self.request
        queryset = super().get_queryset()
        category = request.query_params.get("category", None)
        qty = request.query_params.get("qty", None)
        by_user = request.query_params.get("by_user", None)

        if category is not None and category != "":
            queryset = queryset.filter(category__name__icontains=category)

        if by_user is not None and by_user.lower() == "true":
            if request.user.is_authenticated:
                queryset = queryset.filter(members__in=[request.user])
            else:
                raise AuthenticationFailed(
                    "Authentication credentials were not provided."
                )

        if qty is not None:
            try:
                qty = int(qty)
                queryset = queryset[:qty]
            except:
                pass

        return queryset

    @list_server_docs
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, members=[self.request.user])
        return super().perform_create(serializer)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serializer.delete(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerMemberActionSerializer,
    )
    def kick(self, request, pk=None, *args, **kwargs):
        return self.perform_kick_or_ban_or_unban(request, "kick", "kicked")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerMemberActionSerializer,
    )
    def ban(self, request, pk=None, *args, **kwargs):
        return self.perform_kick_or_ban_or_unban(request, "ban", "banned")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerMemberActionSerializer,
    )
    def unban(self, request, pk=None, *args, **kwargs):
        return self.perform_kick_or_ban_or_unban(request, "unban", "unbanned")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerActionSerializer,
        permission_classes=[IsAuthenticated],
    )
    def join(self, request, pk=None, *args, **kwargs):
        return self.perform_join_or_leave(request, "join", "joined")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerActionSerializer,
        permission_classes=[IsAuthenticated],
    )
    def leave(self, request, pk=None, *args, **kwargs):
        return self.perform_join_or_leave(request, "leave", "left")

    @action(detail=True, methods=["POST"], serializer_class=ServerActionSerializer)
    def roll_invite_code(self, request, pk=None, *args, **kwargs):
        return self.perform_roll_invite_code_or_toggle_status(
            request, "roll_invite_code", "Rolled the invite code."
        )

    @action(detail=True, methods=["POST"], serializer_class=ServerActionSerializer)
    def toggle_status(self, request, pk=None, *args, **kwargs):
        return self.perform_roll_invite_code_or_toggle_status(
            request, "toggle_status", "Toggled the server status."
        )
