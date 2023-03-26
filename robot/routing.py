from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/exec", consumers.SketchBinaryReceiver.as_asgi()),
    path("ws/serial", consumers.SerialWS.as_asgi()),
]