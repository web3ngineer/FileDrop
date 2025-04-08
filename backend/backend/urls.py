from django.contrib import admin
from django.urls import path, include
from . import views

api_urlpatterns = [
    path('', views.root),
    path('health/',views.health),
    path('admin/', admin.site.urls),
    path('files/', include('files.urls')),
    path('user/', include('user.urls')),
]

urlpatterns = [
    path('api/', include(api_urlpatterns)),  # 👈 Everything now starts with /api/
]
