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
    channels = serializers.SerializerMethodField(read_only=True)
    members = serializers.SerializerMethodField(read_only=True)
    banner = FileFieldWithoutValidation()
    icon = FileFieldWithoutValidation()

    class Meta:
        model = Server
        fields = "__all__"

    def validate(self, attrs):
        attrs["icon"] = self.validate_and_process_image("icon")
        attrs["banner"] = self.validate_and_process_image("banner")
        return super().validate(attrs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data["banner"]:
            data["banner"] = (
                f"{settings.WEBSITE_URL}/media/server/server-banner-{get_one_or_two()}.jpg"
            )
        if not data["icon"]:
            data["icon"] = (
                f"{settings.WEBSITE_URL}/media/server/default-server-icon.png"
            )
        return data

    def get_channels(self, obj):
        return ChannelSerializer(obj.channel_server.all(), many=True).data

    def get_members(self, obj):
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
        banner_url = instance.banner
        icon_url = instance.icon
        self.delete_image(icon_url)
        self.delete_image(banner_url)
        instance.delete()
        return instance
