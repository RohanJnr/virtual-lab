from django.urls import path

from .views import AddSketch, Dashboard, RemoteLab


app_name = "base"


urlpatterns = [
    path('dashboard/', Dashboard.as_view(), name="dashboard"),
    path('remote-lab/', RemoteLab.as_view(), name="remote_lab"),
    path('add-sketch/', AddSketch.as_view(), name="add_sketch"),
]