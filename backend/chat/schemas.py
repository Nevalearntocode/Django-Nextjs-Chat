from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from chat.serializers import MessageSerializer

list_message_docs = extend_schema(
    responses=MessageSerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="channel",
            type=OpenApiTypes.STR,
            description="Channel of messages to retrieve (name of the channel, eg. 'general')",
            location=OpenApiParameter.QUERY,
        ),
    ],
)
