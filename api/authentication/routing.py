from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('users/', consumers.UserConsumer.as_asgi()),
]