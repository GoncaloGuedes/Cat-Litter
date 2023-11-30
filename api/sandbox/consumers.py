import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import SandChanges


class SandChangesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        # Fetch the last 5 records from SandChanges asynchronously
        last_changes = await self.get_last_changes()

        # Send the initial data to the WebSocket
        await self.send_changes(last_changes)

    async def disconnect(self, close_code):
        pass

    async def send_changes(self, changes):
        message = [
            {
                "date": change.date.strftime("%Y-%m-%d %H:%M:%S"),
                "day_of_week": change.day_of_week,
            }
            for change in changes
        ]

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def get_last_changes(self):
        # Use synchronous Django query inside an async context
        return list(SandChanges.objects.order_by("-date")[:5])
