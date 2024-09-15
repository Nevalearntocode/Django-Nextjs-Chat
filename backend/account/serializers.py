from rest_framework import serializers
from account.models import Account


class AccountSerializer(serializers.ModelSerializer):
    repassword = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    url = serializers.HyperlinkedIdentityField(view_name="account-detail")

    class Meta:
        model = Account
        fields = ["id", "username", "email", "password", "repassword", "url"]

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
        email = validated_data.get("email")
        account = Account.objects.filter(email=email)
        if account.exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        account = Account.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        account.set_password(validated_data["password"])
        account.save()
        return account
