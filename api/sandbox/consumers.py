# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer


class SandChangesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        # Check if the user is authenticated
        if not self.user.is_authenticated:
            self.close()
            return

        await self.accept()
        await self.channel_layer.group_add("sand_changes_group", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sand_changes_group", self.channel_name)

    async def send_changes(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
