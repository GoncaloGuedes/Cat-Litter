from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("sand_changes/", consumers.SandChangesConsumer.as_asgi()),
]
