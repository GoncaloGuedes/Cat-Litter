import json
import base64
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from .serializers import UserAccountSerializer


class UserConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            self.close()
            return
        # Join user to a group named after their id
        self.group_name = f"user_{self.user.id}"
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        # Leave group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        # Receive message from WebSocket
        data = json.loads(text_data)
        print("Received data:", json.dumps(data, indent=4))

        # thumbnail update
        data_source = data.get("source")
        if data_source == "thumbnail":
            self.receive_thumbnail(data)

    def receive_thumbnail(self, data):
        user = self.scope["user"]
        # convert base64 to image
        image_base64 = data.get("base64")
        image = ContentFile(base64.b64decode(image_base64))

        # update user thumbnail
        filename = data.get("filename")
        user.profile_image.save(filename, image, save=True)

        # Serialize user
        serialized = UserAccountSerializer(user)

        # Send message to room group
        self.send_group(self.group_name, "thumbnail", serialized.data)

    def send_group(self, group_name, source, data):
        response = {"type": "broadcast_group", "source": source, "data": data}
        async_to_sync(self.channel_layer.group_send)(group_name, response)

    def broadcast_group(self, data):
        # Send message to WebSocket
        self.send(text_data=json.dumps(data))
