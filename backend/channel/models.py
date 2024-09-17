from django.db import models
from server.models import Server


class Channel(models.Model):
    name = models.CharField(max_length=255)
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name="channel_server"
    )
    description = models.TextField(null=True, blank=True, max_length=1000)
    topic = models.TextField(null=True, blank=True, max_length=1000)

    def __str__(self) -> str:
        return self.name
