import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async  # Import the decorator
from .models import SandChanges
from django.db.models import F


class SandChangesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        # Check if the user is authenticated
        if not self.user.is_authenticated:
            self.close()
            return

        await self.accept()
        await self.channel_layer.group_add("sand_changes_group", self.channel_name)

        # Send the initial message after connection is accepted
        await self.send_initial_messages()

    @database_sync_to_async
    def get_last_five_changes(self):
        return list(
            SandChanges.objects.all()
            .order_by("-date")[:5]
            .values(
                "id",
                "date",
                "day_of_week",
                "user__first_name",
                "user__last_name",
                "user__profile_image",  # Reference the ImageField directly
            )
        )

    async def send_initial_messages(self):
        last_five = await self.get_last_five_changes()

        message = [
            {
                "id": instance["id"],
                "date": instance["date"].strftime("%Y-%m-%d %H:%M:%S"),
                "day_of_week": instance["day_of_week"],
                "user": f"{instance['user__first_name']} {instance['user__last_name']}",
                "profile_image": self.scope[
                    "user"
                ].profile_image.url,  # Construct the URL
            }
            for instance in last_five
        ]

        await self.send(text_data=json.dumps({"message": message}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sand_changes_group", self.channel_name)

    async def send_changes(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
