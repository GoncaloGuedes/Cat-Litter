from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


# Create your models here.
class SandChanges(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
