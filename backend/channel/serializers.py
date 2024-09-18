from rest_framework import serializers
from channel.models import Channel


class ChannelSerializer(serializers.ModelSerializer):
    server_banner = serializers.ReadOnlyField(source="server.banner")
    url = serializers.HyperlinkedIdentityField(view_name="channel-detail")

    class Meta:
        model = Channel
        fields = "__all__"

    def validate(self, attrs):
        user = self.context.get("request").user
        server = attrs.get("server")
        if server.owner != user:
            raise serializers.ValidationError("Only server owner can create a channel.")
        return super().validate(attrs)
