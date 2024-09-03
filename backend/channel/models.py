

from django.db import models
from django.conf import settings
from server.models import Server


class Channel(models.Model):
    name = models.CharField(max_length=255)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="channel_owner"
    )
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name="channel_server"
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="channel_members"
    )
    description = models.TextField(null=True, blank=True, max_length=1000)
    topic = models.TextField(null=True, blank=True, max_length=1000)



    def __str__(self) -> str:
        return self.name
