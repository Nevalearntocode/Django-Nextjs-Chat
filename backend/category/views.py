from rest_framework.viewsets import ModelViewSet
from category.models import Category
from category.serializers import CategorySerializer
from category.permissions import CategoryPermission



class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [CategoryPermission]
