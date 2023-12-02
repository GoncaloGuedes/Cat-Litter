from django.urls import path

from .views import SandboxPostView, SandboxGetView

urlpatterns = [
    path("", SandboxPostView.as_view(), name="sandbox_post_view"),
    path("<int:id>/", SandboxGetView.as_view(), name="sandbox_get_view"),
]
