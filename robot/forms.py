from django.forms import ModelForm

from .models import SketchBinary


class SketchBinaryForm(ModelForm):
    class Meta:
        model = SketchBinary
        fields = ["title", "binary_file", "description"]