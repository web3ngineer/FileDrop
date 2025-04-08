from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now

class CustomUser(AbstractUser):
    phone_number = models.CharField(_("Phone Number"), max_length=15, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)  # Auto-updates on any field change

    def save(self, *args, **kwargs):
        update_fields = kwargs.pop("update_fields", None)

        # Prevent updated_at change if only last_login is updated
        if update_fields and set(update_fields) == {"last_login"}:
            super().save(update_fields=update_fields, *args, **kwargs)
            return

        super().save(*args, **kwargs)  # Call the parent save method

    def __str__(self):
        return self.username


class Address(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.state}, {self.postal_code}, {self.country}"