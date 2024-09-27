from backend.mixins import R2Mixin
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile


class FileFieldWithoutValidation(serializers.FileField):
    def run_validation(self, data=serializers.empty):
        return data


class ImageSerializerMixin(R2Mixin):

    def validate_and_process_image(self, image_field_name):
        request = self.context.get("request")
        image = request.FILES.get(image_field_name)
        if image != None:
            if not isinstance(image, (InMemoryUploadedFile, TemporaryUploadedFile)):
                raise serializers.ValidationError("Uploaded image is not a valid file.")
            image = self.upload_image(image)
        return image

    def get_user_id(self):
        request = self.context.get("request")
        return str(request.user.id)

    def upload_image(self, image):
        if type(image) != str:
            user_id = self.get_user_id()
            unique_key = self.generate_unique_key(user_id, image.name)
            self.upload_to_r2(image, unique_key)
            image = self.create_image_url(unique_key)
        return image

    def delete_image(self, current_image, request_image=None):
        user_id = self.get_user_id()
        self.delete_from_r2_helper(user_id, current_image, request_image)
