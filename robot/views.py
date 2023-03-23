from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic.base import TemplateView, View
from django.views.generic.list import ListView

from .forms import SketchBinaryForm
from .models import SketchBinary


class Dashboard(ListView):
    model = SketchBinary
    template_name = "robot/dashboard.html"

    def get_context_data(self, **kwargs: dict) -> dict:
        # TODO to change
        context =  super().get_context_data(**kwargs)
        return context
    

class RemoteLab(TemplateView):
    template_name = "robot/remote_lab.html"

    def get_context_data(self, **kwargs: dict) -> dict:
        context =  super().get_context_data(**kwargs)
        sketches = SketchBinary.objects.filter(author=self.request.user)
        context["sketches"] = sketches
        return context
    

class AddSketch(View):

    def get(self, request, *args, **kwargs):
        form = SketchBinaryForm
        context = {
            "form": form
        }
        return render(
            request, "robot/add_sketch.html", context
        )
    
    def post(self, request, *args, **kwargs):
        form = SketchBinaryForm(request.POST, request.FILES)

        if form.is_valid():
            obj = form.save(commit=False)
            obj.author = request.user
            obj.save()
            messages.add_message(request, messages.SUCCESS, 'Sketch Binary added successfully !')
            return redirect("robot:dashboard")