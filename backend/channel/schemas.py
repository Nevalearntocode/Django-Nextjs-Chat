from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from channel.serializers import ChannelSerializer


list_category_docs = extend_schema(
    responses=ChannelSerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="server",
            type=OpenApiTypes.INT,
            description="Server of categories to retrieve (id of the server, eg. '15')",
            location=OpenApiParameter.QUERY,
        ),
    ],
)
