# Generated by Django 5.1 on 2024-09-01 05:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('category', '0002_category_icon'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='icon',
            field=models.URLField(blank=True, default='http://127.0.0.1:8000/media/category/default-category-icon.png', null=True),
        ),
    ]