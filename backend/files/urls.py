from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.root, name='root'),
    path('upload_file/', views.upload_file, name='upload_file'),
    path('delete_file/<int:file_id>/', views.delete_file, name='delete_file'),
    path('get_file/<int:file_id>/', views.get_file, name='get_file'),
    path('get_file_info/<int:file_id>/', views.get_file_info, name='get_file_info'),
    path('get_all_files_info/', views.get_all_files_info, name='get_all_files_info'),
]


from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
