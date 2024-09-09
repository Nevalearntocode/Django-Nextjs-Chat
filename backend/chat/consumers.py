from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from chat.models import Message

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
        self.user = User.objects.get(id=1)
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)

    def receive_json(self, content):
        message = Message.objects.create(
            sender=self.user, channel_id=self.channel_id, content=content["message"]
        )
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "chat.message",
                "new_message": {
                    "id": message.id,
                    "sender": message.sender.username,
                    "content": message.content,
                    "created": message.created.isoformat(),
                },
            },
        )

    def chat_message(self, event):
        self.send_json(event)
        pass

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
