from django.urls import path

from .views import SandboxPostView

urlpatterns = [
    path("", SandboxPostView.as_view(), name="sandbox_post_view"),
]
