from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from chat.models import Message
from django.utils import timezone

User = get_user_model()


class ChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.room_name = None

    def connect(self):
        self.accept()
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            self.close()
        self.channel_id = self.scope["url_route"]["kwargs"]["channels"]
        self.room_name = f"channel_{self.channel_id}"
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)

    def receive_json(self, content):
        message_type = content["type"]
        message_handlers = {
            "send": self.create_message,
            "edit": self.edit_message,
            "delete": self.delete_message,
        }
        message_handler = message_handlers.get(message_type)
        if message_handler:
            message_handler(content)

    def create_message(self, content):
        message = Message.objects.create(
            sender=self.user, channel_id=self.channel_id, content=content["message"]
        )
        self._group_send(
            "send",
            {
                "id": message.id,
                "sender": message.sender.username,
                "content": message.content,
                "created": message.created.isoformat(),
                "edited": message.edited.isoformat() if message.edited else None,
                "deleted": message.deleted,
            },
        )

    def edit_message(self, content):
        message_id = content["message"]["id"]
        message = Message.objects.get(id=message_id)
        message.content = content["message"]["content"]
        message.edited = timezone.now()
        message.save()
        self._group_send(
            "edit",
            {
                "id": message.id,
                "sender": message.sender.username,
                "content": message.content,
                "created": message.created.isoformat(),
                "edited": message.edited.isoformat(),
                "deleted": message.deleted,
            },
        )

    def delete_message(self, content):
        message_id = content["message"]
        message = Message.objects.get(id=message_id)
        message.content = ""
        message.edited = timezone.now()
        message.deleted = True
        message.save()
        self._group_send(
            "delete",
            {
                "id": message.id,
                "sender": message.sender.username,
                "content": message.content,
                "created": message.created.isoformat(),
                "edited": message.edited.isoformat(),
                "deleted": message.deleted,
            },
        )

    def _get_access_token(self):
        for name, value in self.scope["headers"]:
            if name == b"cookie":
                for cookie in value.decode().split("; "):
                    if cookie.startswith("access="):
                        return cookie.split("=")[1]
        return None

    def _group_send(self, message_type, message_data):
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {"type": message_type, "new_message": message_data},
        )

    def send(self, event):
        self.send_json(event)

    def edit(self, event):
        self.send_json(event)

    def delete(self, event):
        self.send_json(event)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
