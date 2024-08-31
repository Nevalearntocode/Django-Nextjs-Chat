from django.db import models
from django.conf import settings
from category.models import Category


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
