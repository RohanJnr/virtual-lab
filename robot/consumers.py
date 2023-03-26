import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class SketchBinaryReceiver(WebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            "sketch-binary-init", self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            "sketch-binary-init", self.channel_name
        )


    # websocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            "sketch-binary-init", {"type": "chat_message", "message": message}
        )

    def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))


class SerialWS(WebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            "sketch-serial", self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            "sketch-serial", self.channel_name
        )


    # websocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if text_data_json["type"] == "output":

            message = text_data_json["message"]
            async_to_sync(self.channel_layer.group_send)(
                "sketch-serial", {"type": "serial_message", "message": message}
            )   
        
        else:
                
            message = text_data_json["message"]

            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                "sketch-serial", {"type": "chat_message", "message": message}
            )

    def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"type": "input", "message": message}))

    def serial_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"type": "output", "message": message}))


