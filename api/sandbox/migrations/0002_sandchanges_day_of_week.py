# Generated by Django 4.2.7 on 2023-11-30 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sandbox', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='sandchanges',
            name='day_of_week',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
