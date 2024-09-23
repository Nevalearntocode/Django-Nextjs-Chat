from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from category.serializers import CategorySerializer


list_category_docs = extend_schema(
    responses=CategorySerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="name",
            type=OpenApiTypes.STR,
            description="Name of category to retrieve",
            location=OpenApiParameter.QUERY,
        ),
    ],  
)