# ASGI config for core project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/

import os

import authentication.routing
import sandbox.routing  # Import the routing for the sandbox app
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            JWTAuthMiddlewareStack(
                URLRouter(
                    authentication.routing.websocket_urlpatterns
                    + sandbox.routing.websocket_urlpatterns  # Add sandbox WebSocket URLs
                )
            )
        ),
    }
)
