import os
import pytz
import requests
from service.models import User, Logging
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import permissions
from django.http import HttpResponse
from oauth2_provider.views import TokenView
from oauth2_provider.models import AccessToken
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()


class StartPage(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        form_complete = False
        if request.user.first_name and \
            request.user.last_name and \
            request.user.date_of_birth and \
            request.user.identification_number and \
            request.user.identification_file.name != 'undefined':
            form_complete = True

        return JsonResponse(
            {
                'message': request.user.username,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'date_of_birth': request.user.date_of_birth,
                'id_number': request.user.identification_number,
                'id_document': request.user.identification_file.url,
                'form_complete': form_complete
            },
            status=200
        )


class Login(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.POST
        username = data.get('username')
        password = data.get('password')
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            try:
                token = AccessToken.objects.get(user_id=user.id)
                expiration = token.expires.replace(tzinfo=pytz.utc)
                if expiration < datetime.now().replace(tzinfo=pytz.utc):
                    revoke_token(token.token)
                    Logging.objects.create(
                        user=user,
                        action='token expired, requesting new',
                        ip=request.META.get('REMOTE_ADDR'),
                        user_agent=request.META.get('HTTP_USER_AGENT')
                    )
                    raise AccessToken.DoesNotExist
                Logging.objects.create(
                    user=user,
                    action='login',
                    ip=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT')
                )
                return JsonResponse({
                    'access_token': token.token,
                    'token_type': 'Bearer',
                    'expires_in': token.expires,
                    'refresh_token': token.refresh_token.token,
                    'scope': 'read write'
                })
            except AccessToken.DoesNotExist:
                pass
        elif user and not user.check_password(password):
            Logging.objects.create(
                user=user,
                action='login failed',
                ip=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT')
            )
            return JsonResponse({'message': 'Invalid credentials'}, status=401)
        else:
            return JsonResponse({'message': 'User not found'}, status=404)

        Logging.objects.create(
            user=user,
            action='token request',
            ip=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT')
        )
        response = request_token(
            username=request.data.get('username'),
            password=request.data.get('password'),
        )
        return response


class IdentificationFiles(APIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.AllowAny]

    def get(self, request, name):
        user = request.user
        file_path = user.identification_file.path
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(file.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = 'attachment; filename=' + name
                return response
        print('File not found')
        return JsonResponse({'message': 'File not found'}, status=404)


class UpdateUser(APIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        user = request.user
        validation_errors = {}
        if not request.data.get('first_name').isalpha():
            validation_errors['first_name'] = 'First name should contain only letters'
        if not request.data.get('last_name').isalpha():
            validation_errors['last_name'] = 'Last name should contain only letters'
        try:
            datetime.strptime(request.data.get('date_of_birth'), '%Y-%m-%d')
        except ValueError:
            validation_errors['date_of_birth'] = 'Date of birth should be in the format YYYY-MM-DD'
        if not request.data.get('identification_number').isdigit():
            validation_errors['identification_number'] = 'Identification number should contain only numbers'
        if validation_errors:
            return JsonResponse(validation_errors, status=400)
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.date_of_birth = request.data.get('date_of_birth', user.date_of_birth)
        user.identification_number = request.data.get('identification_number', user.identification_number)
        file = request.data.get('identification_file')
        if not file == 'undefined':
            user.identification_file = file
        user.save()
        return JsonResponse({'message': 'User updated'}, status=200)


def revoke_token(token):
    response = requests.post(
        'http://localhost:8000/o/revoke_token/',
        data={
            'token': token,
            'client_id': os.getenv('CLIENT_ID'),
            'client_secret': os.getenv('CLIENT_SECRET')
        }
    )
    return response


def request_token(username, password):
    print('requesting token')
    response = requests.post(
        'http://localhost:8000/o/token/',
        data={
            'username': username,
            'password': password,
            'grant_type': 'password',
            'client_id': os.getenv('CLIENT_ID'),
            'client_secret': os.getenv('CLIENT_SECRET')
        }
    )
    return JsonResponse(response.json(), status=response.status_code)


class Logout(APIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        revoke_token(request.data.get('token'))
        Logging.objects.create(
            user=user,
            action='logout',
            ip=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT')
        )
        return JsonResponse({'message': 'Logged out'}, status=200)


class LoginInfo(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        loggins = Logging.objects.filter(user=request.user).order_by('-date')[:5]
        return JsonResponse(
            {
                'logins': [
                    {
                        'action': login.action,
                        'ip': login.ip,
                        'user_agent': login.user_agent,
                        'timestamp': login.date
                    }
                    for login in loggins
                ]
            },
            status=200
        )
