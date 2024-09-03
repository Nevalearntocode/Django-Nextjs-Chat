# Generated by Django 5.1 on 2024-08-31 14:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0001_initial'),
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='server',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='server_category', to='category.category'),
        ),
        migrations.RemoveField(
            model_name='channel',
            name='members',
        ),
        migrations.RemoveField(
            model_name='channel',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='channel',
            name='server',
        ),
        migrations.DeleteModel(
            name='Category',
        ),
        migrations.DeleteModel(
            name='Channel',
        ),
    ]