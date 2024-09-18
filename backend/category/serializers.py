from rest_framework import serializers
from category.models import Category
from django.conf import settings
from backend.serializers import ImageSerializerMixin, FileFieldWithoutValidation


class CategorySerializer(serializers.ModelSerializer, ImageSerializerMixin):
    url = serializers.HyperlinkedIdentityField(view_name="category-detail")
    icon = serializers.ReadOnlyField()
    icon_file = FileFieldWithoutValidation(write_only=True)

    class Meta:
        model = Category
        fields = "__all__"
        
    def validate(self, attrs):
        attrs["icon"] = self.validate_and_process_image("icon_file")
        attrs.pop("icon_file")
        return super().validate(attrs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data.get("icon"):
            data["icon"] = (
                f"{settings.WEBSITE_URL}/media/category/default-category-icon.png"
            )
        return data
