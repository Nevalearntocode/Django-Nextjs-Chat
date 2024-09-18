from chat.models import Message
from chat.serializers import MessageSerializer
from rest_framework.viewsets import ModelViewSet
from chat.schemas import list_message_docs
from chat.permissions import MessagePermission
from django.db.models import Q


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [MessagePermission]

    def get_queryset(self):
        request = self.request
        queryset = (
            super()
            .get_queryset()
            .filter(Q(channel__server__members__in=[request.user]))
        )
        channel_id = request.query_params.get("channel", None)
        if channel_id is not None and channel_id != "":
            queryset = queryset.filter(channel=channel_id)
        return queryset

    @list_message_docs
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
