from django.urls import path

from .views import About, Home


app_name = "base"


urlpatterns = [
    path('', Home.as_view()),
    path('home', Home.as_view()),
    path('about', About.as_view()),
]