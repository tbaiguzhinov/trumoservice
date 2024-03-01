from django.urls import include, path
from django.contrib import admin

from service import views


urlpatterns = [
    path('', views.StartPage.as_view(), name='start'),
    path('update', views.UpdateUser.as_view(), name='update_user'),
    path('admin/', admin.site.urls),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('logout/', views.Logout.as_view(), name='logout'),
    path('login/', views.Login.as_view(), name='login'),
    path('login-info', views.LoginInfo.as_view(), name='login-info'),
]