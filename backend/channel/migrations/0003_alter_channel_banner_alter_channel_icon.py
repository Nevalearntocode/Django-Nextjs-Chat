# Generated by Django 5.1 on 2024-09-01 05:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('channel', '0002_channel_banner_channel_icon'),
    ]

    operations = [
        migrations.AlterField(
            model_name='channel',
            name='banner',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='channel',
            name='icon',
            field=models.URLField(blank=True, null=True),
        ),
    ]