from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from account.serializers import (
    AccountSerializer,
    AccountDetailSerializer,
    ChangePasswordSerializer,
)
from account.models import Account
from account.permissions import AccountPermission
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from django.contrib.auth import update_session_auth_hash


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AccountPermission]
    
    @action(detail=False, methods=["PUT"], serializer_class=ChangePasswordSerializer)
    def change_password(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        update_session_auth_hash(request, request.user)
        return Response(
            {"detail": "Password changed successfully."}, status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["GET", "PUT", "PATCH"])
    def me(self, request):
        self.kwargs["pk"] = request.user.pk
        if request.method == "GET":
            return self.retrieve(request)
        elif request.method == "PUT":
            return self.update(request)
        elif request.method == "PATCH":
            return self.partial_update(request)

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = AccountDetailSerializer
        return super().retrieve(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.set_cookie(
            "access",
            httponly=settings.AUTH_COOKIE_HTTPONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            secure=settings.AUTH_COOKIE_SECURE,
            max_age=0,
            path="/",
        )
        response.set_cookie(
            "refresh",
            httponly=settings.AUTH_COOKIE_HTTPONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            secure=settings.AUTH_COOKIE_SECURE,
            max_age=0,
            path="/",
        )
        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs) -> Response:
        access_token = request.COOKIES.get("access")
        data = request.data.copy()
        if access_token:
            data["token"] = access_token
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        response_data = {"access": data.get("token")}

        return Response(response_data, status=status.HTTP_200_OK)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")
        data = request.data.copy()
        if refresh_token:
            data["refresh"] = refresh_token
        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        if response.status_code == 200:
            access_token = response.data["access"]
            response.set_cookie(
                "access",
                access_token,
                httponly=settings.AUTH_COOKIE_HTTPONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                secure=settings.AUTH_COOKIE_SECURE,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
            )

        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data["access"]
            refresh_token = response.data["refresh"]

            response.set_cookie(
                "access",
                access_token,
                httponly=settings.AUTH_COOKIE_HTTPONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                secure=settings.AUTH_COOKIE_SECURE,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
            )
            response.set_cookie(
                "refresh",
                refresh_token,
                httponly=settings.AUTH_COOKIE_HTTPONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                secure=settings.AUTH_COOKIE_SECURE,
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
            )

        return response
