from django.urls import path, include

from . import views

urlpatterns = [
    path('account/signin/', views.signin, name='signin'),
    path('account/signup/', views.signup, name='signup'),
    path('account/logout/', views.signout, name='logout'),
    path('get_csrf/', views.get_csrf_token, name='get_csrf_token'),
    path('getuser/', views.get_user_info, name='get_user_info'),
    path('change_password/', views.change_password, name='change_password'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('delete_account/', views.delete_account, name='delete_account'),
    path('change_username/', views.change_username, name='change_username'),
    
    # Address URLs 
    path('address/add/', views.add_address, name='add_address'),
    path('address/list/', views.get_addresses, name='get_addresses'),
    path('address/update/<int:address_id>/', views.update_address, name='update_address'),
    path('address/delete/<int:address_id>/', views.delete_address, name='delete_address'),
    path('address/set_primary/<int:address_id>/', views.set_primary, name='set_primary'),
]
