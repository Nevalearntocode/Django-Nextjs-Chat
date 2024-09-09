from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from server.serializers import ServerSerializer

list_server_docs = extend_schema(
    responses=ServerSerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="category",
            type=OpenApiTypes.STR,
            description="Category of servers to retrieve (name of the category, eg. 'games')",
            location=OpenApiParameter.QUERY,
        ),
        OpenApiParameter(
            name="qty",
            type=OpenApiTypes.INT,
            description="How many servers to retrieve",
            location=OpenApiParameter.QUERY,
        ),
        OpenApiParameter(
            name="by_user",
            type=OpenApiTypes.BOOL,
            description="Retrieve servers where user is a member",
            location=OpenApiParameter.QUERY,
        ),
    ],
)
