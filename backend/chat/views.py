from chat.models import Message
from chat.serializers import MessageSerializer
from rest_framework.viewsets import ModelViewSet
from chat.schemas import list_message_docs
from drf_spectacular.utils import extend_schema


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @list_message_docs
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
