from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from service.models import User


class CustomUserAdmin(UserAdmin):
    ...


admin.site.register(User, CustomUserAdmin)
