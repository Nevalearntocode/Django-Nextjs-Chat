from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import AuthenticationFailed
from server.models import Server
from server.serializers import ServerSerializer, AddToServerSerializer
from server.schema import list_server_docs
from server.permissions import ServerPermission
from rest_framework.decorators import action


class ServerViewSet(ModelViewSet):
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
            queryset = queryset.filter(category__name=category)

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

    @action(detail=True, methods=["POST"], serializer_class=AddToServerSerializer)
    def join(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        members = request.data.get("members")
        instance.members.add(*members)
        instance.save()
        return Response(
            {"detail": "Successfully joined the server."}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["POST"], serializer_class=AddToServerSerializer)
    def leave(self, request, pk=None, *args, **kwargs):
        instance = self.get_object()
        members = request.data.get("members", [])

        # Filter out the owner to prevent them from being removed
        if str(instance.owner.id) in members:
            return Response(
                {"detail": "You cannot remove owner from the server."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not members:
            return Response(
                {"detail": "No valid members to remove."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Remove the members from the server
        instance.members.remove(*members)
        instance.save()

        return Response(
            {"detail": "Successfully left the server."}, status=status.HTTP_200_OK
        )
