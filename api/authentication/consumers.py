import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile

from .serializers import UserAccountSerializer


class UserConsumer(WebsocketConsumer):
    def connect(self):
        """
        Handles the WebSocket connection initiation.
        """
        self.user = self.scope["user"]

        # Check if the user is authenticated
        if not self.user.is_authenticated:
            self.close()
            return

        # Join user to a group named after their id
        self.group_name = f"user_{self.user.id}"
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        """
        Handles the WebSocket connection termination.
        """
        # Leave group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        """
        Handles incoming WebSocket messages.
        """
        data = json.loads(text_data)
        print("Received data:", json.dumps(data, indent=4))

        # Handle different data sources
        data_source = data.get("source")
        if data_source == "thumbnail":
            self.receive_thumbnail(data)

    def receive_thumbnail(self, data):
        """
        Handles thumbnail update messages.
        """
        user = self.scope["user"]

        # Convert base64 to image
        image_base64 = data.get("base64")
        image = ContentFile(base64.b64decode(image_base64))

        # Update user thumbnail
        filename = data.get("filename")
        user.profile_image.save(filename, image, save=True)

        # Serialize user
        serialized = UserAccountSerializer(user)

        # Send message to room group
        self.send_group(self.group_name, "thumbnail", serialized.data)

    def send_group(self, group_name, source, data):
        """
        Sends a message to a specified WebSocket group.
        """
        response = {"type": "broadcast_group", "source": source, "data": data}
        async_to_sync(self.channel_layer.group_send)(group_name, response)

    def broadcast_group(self, data):
        """
        Sends a message to the WebSocket group.
        """
        # Send message to WebSocket
        self.send(text_data=json.dumps(data))
