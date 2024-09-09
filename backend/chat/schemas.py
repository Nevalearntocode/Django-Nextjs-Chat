from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from chat.serializers import MessageSerializer

list_message_docs = extend_schema(
    responses=MessageSerializer(many=True),
    parameters=[
        # add parameters after
    ],
)
