# Generated by Django 5.1 on 2024-09-16 15:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('channel', '0004_remove_channel_banner_remove_channel_icon'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='channel',
            name='members',
        ),
    ]
