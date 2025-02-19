# Generated by Django 4.2.7 on 2023-12-02 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sandbox', '0002_sandchanges_day_of_week'),
    ]

    operations = [
        migrations.AddField(
            model_name='sandchanges',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='sandbox_images/'),
        ),
        migrations.AlterField(
            model_name='sandchanges',
            name='day_of_week',
            field=models.CharField(default=None, max_length=10),
            preserve_default=False,
        ),
    ]
