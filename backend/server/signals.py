from server.models import Server
from django.db.models.signals import post_save
from channel.models import Channel
from django.dispatch import receiver


@receiver(post_save, sender=Server)
def create_channel(sender, instance, created, **kwargs):
    if created:
        Channel.objects.create(
            name="general",
            server=instance,
            description="Default chat channel",
            topic=instance.name,
        )
