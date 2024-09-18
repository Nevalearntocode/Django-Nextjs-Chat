from chat.models import Message
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.username")
    url = serializers.HyperlinkedIdentityField(view_name="message-detail")
    deleted = serializers.ReadOnlyField()

    class Meta:
        model = Message
        fields = "__all__"

    def validate(self, attrs):
        user = self.context.get("request").user
        channel = attrs.get("channel")
        if not user in channel.server.members.all():
            raise serializers.ValidationError("You are not a member of this server.")
        return super().validate(attrs)
