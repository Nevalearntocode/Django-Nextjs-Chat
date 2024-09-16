from rest_framework import serializers
from account.models import Account


class AccountSerializer(serializers.ModelSerializer):
    repassword = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    url = serializers.HyperlinkedIdentityField(view_name="account-detail")

    class Meta:
        model = Account
        fields = ["id", "username", "password", "repassword", "url"]

    def validate(self, attrs):
        password = attrs.get("password")
        repassword = attrs.get("repassword")
        if password != repassword:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        attrs.pop("repassword")
        return super().validate(attrs)

    def create(self, validated_data):
        account = Account.objects.create(
            username=validated_data["username"],
        )
        account.set_password(validated_data["password"])
        account.save()
        return account


class AccountDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id", "username", "first_name", "last_name"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({"old_password": "Incorrect password."})
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
