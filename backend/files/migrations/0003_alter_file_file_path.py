# Generated by Django 5.1.7 on 2025-04-04 06:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0002_rename_created_at_file_uploaded_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='file_path',
            field=models.FileField(blank=True, default='files/default.txt', upload_to='files/'),
        ),
    ]
