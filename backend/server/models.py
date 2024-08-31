from django.db import models
from django.conf import settings


class Category(models.Model):
    
    class Meta:
        verbose_name_plural = "Categories"
    
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True, max_length=1000)

    def __str__(self) -> str:
        return self.name


class Server(models.Model):
    name = models.CharField(max_length=255)
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

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name
