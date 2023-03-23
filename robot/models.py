from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class SketchBinary(models.Model):
    """ESP 32 compiled Sketch Binary"""
    author = models.ForeignKey(User, on_delete=models.SET_DEFAULT, default=None)
    title = models.CharField(max_length=255, unique=True)
    binary_file = models.FileField(upload_to="robot_binaries")
    description = models.TextField()
    last_run_datetime = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.title
    
    def __str__(self) -> str:
        return self.title