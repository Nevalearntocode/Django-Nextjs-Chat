from rest_framework.viewsets import ModelViewSet
from category.models import Category
from category.serializers import CategorySerializer
from category.permissions import CategoryPermission
from category.schemas import list_category_docs


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [CategoryPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        name = request.query_params.get("name", None)

        if name is not None and name != "":
            queryset = queryset.filter(name__icontains=name)

        return queryset

    @list_category_docs
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
