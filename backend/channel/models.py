import random
from django.db import models
from django.conf import settings
from server.models import Server


def get_one_or_two():
    return random.choice([1, 2])


class Channel(models.Model):
    name = models.CharField(max_length=255)
    icon = models.URLField(blank=True, null=True)
    banner = models.URLField(blank=True, null=True)
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

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        if self.banner == "":
            self.banner = f"{settings.WEBSITE_URL}/media/channel/channel-banner-{get_one_or_two()}.jpg"
        if self.icon == "":
            self.icon = f"{settings.WEBSITE_URL}/media/channel/default-channel-icon.png"
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name
