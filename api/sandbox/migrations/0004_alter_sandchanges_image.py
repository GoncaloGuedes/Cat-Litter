# Generated by Django 4.2.7 on 2023-12-02 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sandbox', '0003_sandchanges_image_alter_sandchanges_day_of_week'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sandchanges',
            name='image',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='sandbox_images/'),
        ),
    ]
