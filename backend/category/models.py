from django.db import models


class Category(models.Model):

    class Meta:
        verbose_name_plural = "Categories"

    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True, max_length=1000)

    def __str__(self) -> str:
        return self.name
