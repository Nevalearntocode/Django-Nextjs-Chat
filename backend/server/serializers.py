from rest_framework import serializers
from server.models import Server
from channel.models import Channel


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        exclude = ["members", "server"]


class ServerSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="server-detail")
    channels = serializers.SerializerMethodField(read_only=True)
    members = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Server
        fields = "__all__"

    def get_channels(self, obj):
        return ChannelSerializer(obj.channel_server.all(), many=True).data

    def get_members(self, obj):
        return obj.members.count()
