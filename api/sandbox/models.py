from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

User = get_user_model()


class SandChanges(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    day_of_week = models.CharField(max_length=10)

    def save(self, *args, **kwargs):
        self.day_of_week = self.date.strftime("%A")
        super().save(*args, **kwargs)


@receiver(post_save, sender=SandChanges)
def send_changes_on_save(sender, instance, **kwargs):
    channel_layer = get_channel_layer()

    # Get the latest 5 records
    last_five = (
        SandChanges.objects.all()
        .order_by("-date")[:5]
        .values(
            "id",
            "date",
            "day_of_week",
            "user__first_name",
            "user__last_name",
            "user__profile_image__url",
        )
    )

    # Format the data for each record
    records = [
        {
            "date": record["date"].strftime("%Y-%m-%d %H:%M:%S"),
            "day_of_week": record["day_of_week"],
            "user": f"{record['user__first_name']} {record['user__last_name']}",
            "profile_image": record["user__profile_image__url"],
        }
        for record in last_five
    ]

    # Send the message to the group
    async_to_sync(channel_layer.group_send)(
        "sand_changes_group",
        {
            "type": "send_changes",
            "message": records,
        },
    )
