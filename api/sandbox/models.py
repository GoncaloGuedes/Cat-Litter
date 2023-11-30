from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class SandChanges(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    date = models.DateTimeField(auto_now_add=True)
    day_of_week = models.CharField(max_length=10, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Calculate the day of the week based on the date
        day_of_week = self.date.strftime("%A")  # Adjust the format as needed

        # Update the day_of_week field
        self.day_of_week = day_of_week

        # Call the original save method
        super().save(*args, **kwargs)
