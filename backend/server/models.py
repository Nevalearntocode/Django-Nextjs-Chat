import random
from django.db import models
from django.conf import settings
from category.models import Category


def get_one_or_two():
    return random.choice([1, 2])


class Server(models.Model):
    name = models.CharField(max_length=255)
    icon = models.URLField(blank=True, null=True)
    banner = models.URLField(blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="server_category"
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="server_owner"
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="server_members"
    )
    description = models.TextField(null=True, blank=True, max_length=1000)

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        if self.banner == "":
            self.banner = f"{settings.WEBSITE_URL}/media/server/server-banner-{get_one_or_two()}.jpg"
        if self.icon == "":
            self.icon = f"{settings.WEBSITE_URL}/media/server/default-server-icon.png"
        super().save(*args, **kwargs)
