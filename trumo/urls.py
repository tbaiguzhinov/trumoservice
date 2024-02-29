from django.urls import include, path
from django.contrib import admin

from service import views
from oauth2_provider import views as oauth2_views


oath_patterns = [
    path('authorize/', oauth2_views.AuthorizationView.as_view(), name='authorize'),
    path('token/', views.CustomTokenView.as_view(), name='token'),
    path('revoke_token/', oauth2_views.RevokeTokenView.as_view(), name='revoke-token'),
    path('introspect/', oauth2_views.IntrospectTokenView.as_view(), name='introspect'),
]

urlpatterns = [
    path('', views.StartPage.as_view(), name='start'),
    path('admin/', admin.site.urls),
    path('o/', include(oath_patterns)),
]