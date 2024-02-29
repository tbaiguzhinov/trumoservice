import os
from .models import User
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import permissions
from django.http import HttpResponse
from oauth2_provider.views import TokenView
from oauth2_provider.models import AccessToken

from dotenv import load_dotenv

load_dotenv()


class StartPage(APIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return JsonResponse(
            {'message': request.user.username},
            status=200
        )


class CustomTokenView(TokenView):
    def post(self, request, *args, **kwargs):
        data = request.POST
        username = data.get('username')
        password = data.get('password')
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            token = AccessToken.objects.get(user_id=user.id)
            return JsonResponse({
                'access_token': token.token,
                'token_type': 'Bearer',
                'expires_in': token.expires,
                'refresh_token': token.refresh_token.token,
                'scope': 'read write'
            })

        response = super().post(request, *args, **kwargs)
        return response
