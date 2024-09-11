from chat.models import Message
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.username")
    
    class Meta:
        model = Message
        fields = "__all__"