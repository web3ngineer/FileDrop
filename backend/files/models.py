from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from user.models import CustomUser
import os

# Define choices using TextChoices
class FileType(models.TextChoices):
    TXT = 'txt', 'Text File'
    PDF = 'pdf', 'PDF File'
    DOCX = 'docx', 'Word Document'
    XLSX = 'xlsx', 'Excel Spreadsheet'
    PPTX = 'pptx', 'PowerPoint Presentation'
    JPG = 'jpg', 'JPEG Image'
    PNG = 'png', 'PNG Image'

class File(models.Model):
    file_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    file_name = models.CharField(max_length=100)
    file_type = models.CharField(max_length=10, choices=FileType.choices, default=FileType.TXT)
    file_size = models.PositiveIntegerField()
    file_path = models.FileField(upload_to='files/',blank=True, null=False, default='files/default.txt')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.file_name} uploaded by {self.file_owner.username}"
    
    
