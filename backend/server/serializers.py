import random
from rest_framework import serializers
from server.models import Server
from channel.models import Channel
from backend.serializers import (
    FileFieldWithoutValidation,
    ImageSerializerMixin,
)
from django.conf import settings


def get_one_or_two():
    return random.choice([1, 2])


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        exclude = ["members", "server"]


class ServerSerializer(serializers.ModelSerializer, ImageSerializerMixin):
    url = serializers.HyperlinkedIdentityField(view_name="server-detail")
    owner = serializers.ReadOnlyField(source="owner.username")
    invite_code = serializers.ReadOnlyField()
    channels = serializers.SerializerMethodField(read_only=True)
    amount_members = serializers.SerializerMethodField(read_only=True)
    banner = serializers.ReadOnlyField()
    icon = serializers.ReadOnlyField()
    banner_file = FileFieldWithoutValidation(write_only=True)
    icon_file = FileFieldWithoutValidation(write_only=True)

    class Meta:
        model = Server
        exclude = ["members"]

    def validate(self, attrs):
        icon_url = self.validate_and_process_image("icon_file")
        banner_url = self.validate_and_process_image("banner_file")
        if icon_url:
            attrs["icon"] = icon_url
        if banner_url:
            attrs["banner"] = banner_url

        attrs.pop("banner_file")
        attrs.pop("icon_file")
        return attrs

    def get_channels(self, obj):
        return ChannelSerializer(obj.channel_server.all(), many=True).data

    def get_amount_members(self, obj):
        return obj.members.count()

    def update(self, instance, validated_data):
        current_icon = instance.icon
        current_banner = instance.banner
        if "banner" in validated_data and validated_data["banner"] != None:
            request_banner = self.upload_image(validated_data["banner"])
            self.delete_image(current_banner, request_banner)
            validated_data["banner"] = request_banner
        if "icon" in validated_data and validated_data["icon"] != None:
            request_icon = self.upload_image(validated_data["icon"])
            self.delete_image(current_icon, request_icon)
            validated_data["icon"] = request_icon
        return super().update(instance, validated_data)

    def delete(self, instance):
        icon_url = instance.icon
        banner_url = instance.banner
        if icon_url:
            self.delete_image(icon_url)
        if banner_url:
            self.delete_image(banner_url)
        instance.delete()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if not data.get("banner"):
            data["banner"] = (
                f"{settings.WEBSITE_URL}/media/server/server-banner-{get_one_or_two()}.jpg"
            )

        if not data.get("icon"):
            data["icon"] = (
                f"{settings.WEBSITE_URL}/media/server/default-server-icon.png"
            )

        return data


class AddToServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Server
        fields = ["members"]
