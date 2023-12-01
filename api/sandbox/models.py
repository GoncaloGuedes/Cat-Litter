from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


User = get_user_model()


# models.py


class SandChanges(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    day_of_week = models.CharField(max_length=10)

    # On save add the day of the week
    def save(self, *args, **kwargs):
        self.day_of_week = self.date.strftime("%A")
        super().save(*args, **kwargs)


# Signal to notify WebSocket consumers when a new record is created
@receiver(post_save, sender=SandChanges)
def send_changes_on_save(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "sand_changes_group",
        {
            "type": "send_changes",
            "message": {
                "date": instance.date.strftime("%Y-%m-%d %H:%M:%S"),
                "day_of_week": instance.day_of_week,
            },
        },
    )
