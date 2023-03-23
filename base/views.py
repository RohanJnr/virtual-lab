from django.shortcuts import render
from django.views.generic.base import TemplateView


class Home(TemplateView):
    template_name = "base/home.html"


class About(TemplateView):
    template_name = "base/about.html"