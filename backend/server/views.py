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
from django.db.models import Count


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
        name = request.query_params.get("name", None)

        if category is not None and category != "":
            queryset = queryset.filter(category__name__icontains=category)

        if by_user is not None and by_user.lower() == "true":
            if request.user.is_authenticated:
                queryset = queryset.filter(members__in=[request.user])
            else:
                raise AuthenticationFailed(
                    "Authentication credentials were not provided."
                )

        if name is not None and name != "":
            queryset = queryset.filter(name__icontains=name)

        if qty is not None:
            try:
                qty = int(qty)
                queryset = queryset[:qty]
            except:
                pass

        queryset = queryset.annotate(amount_members=Count("members")).order_by(
            "-amount_members"
        )
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
        """
        Kick members from the server.

        This endpoint will kick the members passed in the request body from the server.
        The request body should contain a list of member ids to kick.

        Args:
            request (Request): The request object
            pk (str): The primary key of the server
            *args (): Additional arguments
            **kwargs (): Additional keyword arguments

        Returns:
            Response: A response object with the result of the action
        """
        return self.perform_kick_or_ban_or_unban(request, "kick", "kicked")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerMemberActionSerializer,
    )
    def ban(self, request, pk=None, *args, **kwargs):
        """
        Ban members from the server.

        This endpoint will ban the members passed in the request body from the server.
        The request body should contain a list of member ids to ban.
        Banned members will not be able to join the server.

        Args:
            request (Request): The request object
            pk (str): The primary key of the server
            *args (): Additional arguments
            **kwargs (): Additional keyword arguments

        Returns:
            Response: A response object with the result of the action
        """
        return self.perform_kick_or_ban_or_unban(request, "ban", "banned")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerMemberActionSerializer,
    )
    def unban(self, request, pk=None, *args, **kwargs):
        """
        Unban members from the server.

        This endpoint will unban the members passed in the request body from the server.
        The request body should contain a list of member ids to unban.
        Unbanned members will be able to join the server again.

        Args:
            request (Request): The request object
            pk (str): The primary key of the server
            *args (): Additional arguments
            **kwargs (): Additional keyword arguments

        Returns:
            Response: A response object with the result of the action
        """
        return self.perform_kick_or_ban_or_unban(request, "unban", "unbanned")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerActionSerializer,
        permission_classes=[IsAuthenticated],
    )
    def join(self, request, pk=None, *args, **kwargs):
        """
        Join a server.

        This endpoint will add the current user to the server with the given primary key.
        The request body should not contain any data.

        Args:
            request (Request): The request object
            pk (str): The primary key of the server
            *args (): Additional arguments
            **kwargs (): Additional keyword arguments

        Returns:
            Response: A response object with the result of the action
        """
        return self.perform_join_or_leave(request, "join", "joined")

    @action(
        detail=True,
        methods=["POST"],
        serializer_class=ServerActionSerializer,
        permission_classes=[IsAuthenticated],
    )
    def leave(self, request, pk=None, *args, **kwargs):
        """
        Leave a server.

        This endpoint will remove the current user from the server with the given primary key.
        The request body should not contain any data.

        Args:
            request (Request): The request object
            pk (str): The primary key of the server
            *args (): Additional arguments
            **kwargs (): Additional keyword arguments

        Returns:
            Response: A response object with the result of the action
        """

        return self.perform_join_or_leave(request, "leave", "left")

    @action(detail=True, methods=["POST"], serializer_class=ServerActionSerializer)
    def roll_invite_code(self, request, pk=None, *args, **kwargs):
        """
        Roll the invite code of a server.

        This endpoint will roll the invite code of the server with the given primary key.
        The request body should not contain any data.

        Args:
            request (Request): The request object
            pk (str): The primary key of the server
            *args (): Additional arguments
            **kwargs (): Additional keyword arguments

        Returns:
            Response: A response object with the result of the action
        """

        return self.perform_roll_invite_code_or_toggle_status(
            request, "roll_invite_code", "Rolled the invite code."
        )

    @action(detail=True, methods=["POST"], serializer_class=ServerActionSerializer)
    def toggle_status(self, request, pk=None, *args, **kwargs):
        """
        Toggle the status of a server.

        This endpoint will toggle the status of the server with the given primary key.
        The request body should not contain any data.

        Args:
            request (Request): The request object
            pk (str): The primary key of the server
            *args (): Additional arguments
            **kwargs (): Additional keyword arguments

        Returns:
            Response: A response object with the result of the action
        """
        return self.perform_roll_invite_code_or_toggle_status(
            request, "toggle_status", "Toggled the server status."
        )
