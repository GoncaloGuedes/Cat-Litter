from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

User = get_user_model()


class SandChanges(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to="sandbox_images/", null=True, blank=True, default=None
    )
    date = models.DateTimeField(auto_now_add=True)
    day_of_week = models.CharField(max_length=10, null=True, blank=True, default=None)

    def save(self, *args, **kwargs):
        self.day_of_week = self.date.strftime("%A")
        super().save(*args, **kwargs)


@receiver(post_save, sender=SandChanges)
def send_changes_on_save(sender, instance, **kwargs):
    channel_layer = get_channel_layer()

    changes = SandChanges.objects.all().order_by("-date")[:5]
    result = []
    message = []
    for change in changes:
        user_data = {
            "id": change.id,
            "date": change.date,
            "day_of_week": change.day_of_week,
            "user__first_name": change.user.first_name,
            "user__last_name": change.user.last_name,
            "user__profile_image__url": change.user.profile_image.url
            if change.user.profile_image
            else None,
        }
        result.append(user_data)

        message = [
            {
                "id": instance["id"],
                "date": instance["date"].strftime("%Y-%m-%d %H:%M:%S"),
                "day_of_week": instance["day_of_week"],
                "user": f"{instance['user__first_name']} {instance['user__last_name']}",
                "profile_image": instance["user__profile_image__url"],
            }
            for instance in result
        ]
    # Send the message to the group
    async_to_sync(channel_layer.group_send)(
        "sand_changes_group",
        {
            "type": "send_changes",
            "message": message,
        },
    )
