from django.db import models
from django.conf import settings
from channel.models import Channel


class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="message_user"
    )
    channel = models.ForeignKey(
        Channel, on_delete=models.CASCADE, related_name="message_channel"
    )
    content = models.TextField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    