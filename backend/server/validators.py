import os
from django.core.exceptions import ValidationError
from PIL import Image


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            if img.width > 70 or img.height > 70:
                raise ValidationError(
                    f"The maximum allowed dimensions for the image are 70x70. "
                    f"Your image's dimensions: {img.size[0]}x{img.size[1]}"
                )


def validate_image_file_extension(value):
    ext = os.path.splitext(value.name)[
        1
    ].lower()  # Ensure extension check is case-insensitive
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif"]
    if ext not in valid_extensions:
        raise ValidationError(
            f"Unsupported file extension: {ext}. Supported extensions are {', '.join(valid_extensions)}."
        )
