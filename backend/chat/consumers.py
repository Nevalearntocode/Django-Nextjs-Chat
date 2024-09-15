from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from chat.models import Message
from server.models import get_one_or_two
from django.utils import timezone


User = get_user_model()


class ChatConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.user = None

    def connect(self):
        self.accept()
        self.channel_id = self.scope["url_route"]["kwargs"]["channels"]
        self.room_name = f"channel_{self.channel_id}"
        self.user = User.objects.get(id=get_one_or_two())
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)

    def receive_json(self, content):
        message_type = content["type"]
        if message_type == "send":
            self.create_message(content, message_type)

        if message_type == "edit":
            self.edit_message(content, message_type)

        if message_type == "delete":
            self.delete_message(content, message_type)

    def create_message(self, content, message_type):
        message = Message.objects.create(
            sender=self.user, channel_id=self.channel_id, content=content["message"]
        )
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": message_type,
                "new_message": {
                    "id": message.id,
                    "sender": message.sender.username,
                    "content": message.content,
                    "created": message.created.isoformat(),
                    "edited": message.edited.isoformat(),
                    "deleted": message.deleted,
                },
            },
        )

    def get_access_token(self):
        for name, value in self.scope["headers"]:
            if name == b"cookie":
                cookies = value.decode().split("; ")
                for cookie in cookies:
                    if cookie.startswith("access="):
                        return cookie.split("=")[1]
        return None

    def get_refresh_token(self):
        for name, value in self.scope["headers"]:
            if name == b"cookie":
                cookies = value.decode().split("; ")
                for cookie in cookies:
                    if cookie.startswith("refresh="):
                        return cookie.split("=")[1]
        return None

    def send(self, event):
        self.send_json(event)
        pass

    def edit(self, event):
        self.send_json(event)
        pass

    def delete(self, event):
        self.send_json(event)
        pass

    def edit_message(self, content, message_type):
        message_id = content["message"]["id"]
        message_content = content["message"]["content"]
        message = Message.objects.get(id=message_id)
        message.content = message_content
        message.edited = timezone.now()
        message.save()
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": message_type,
                "new_message": {
                    "id": message.id,
                    "sender": message.sender.username,
                    "content": message.content,
                    "created": message.created.isoformat(),
                    "edited": message.edited.isoformat(),
                    "deleted": message.deleted,
                },
            },
        )

    def delete_message(self, content, message_type):
        message_id = content["message"]
        print(message_id)
        message = Message.objects.get(id=message_id)
        message.content = ""
        message.edited = timezone.now()
        message.deleted = True
        message.save()
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": message_type,
                "new_message": {
                    "id": message.id,
                    "sender": message.sender.username,
                    "content": message.content,
                    "created": message.created.isoformat(),
                    "edited": message.edited.isoformat(),
                    "deleted": message.deleted,
                },
            },
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
