import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv'
import express from "express"
import multer from "multer"
import cors from "cors"

import * as http from 'http';


let storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, './uploads');    
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);   
  }
});

const upload = multer({ storage: storage })
const app = express();
const server = http.createServer(app);

app.use(cors())

dotenv.config()

const wss = new WebSocketServer({ server });

const WebPassword = process.env.WEB_PASSWORD
const RoboPassword = process.env.ROBO_PASSWORD

console.log(WebPassword, RoboPassword)

const CONNECTIONS = {
  web: null,
  robo: null
}


const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    console.log("Pinging all...")
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 5000);


console.log("running")

wss.on('connection', function connection(ws) {
  console.log("got Connection")
  ws.isAlive = true;

  ws.on('error', console.error);

  ws.on("close", () => {
    console.log("Closed")

    if (ws === CONNECTIONS.web) {
      CONNECTIONS.web = null
    }

    clearInterval(interval)
  })

  ws.on('message', function message(data) {
    const dataParsed = JSON.parse(data)

    switch (dataParsed.protocol) {

      case "connect":

        if (!CONNECTIONS.web) {

          // check password
          if (dataParsed.password !== WebPassword) {
            ws.send(JSON.stringify({
              protocol: "reject",
              message: "Incorrect Password."
            }))
          }
          else {
            CONNECTIONS.web = ws
            ws.send(JSON.stringify({
              protocol: "connect"
            }))
          }

        } else {

          const rejectionJsonString = JSON.stringify({
            "protocol": "reject",
            "message": "Someone else is currently online."
          })

          ws.send(rejectionJsonString)
        }
        break;

      default:
        ws.send(JSON.stringify(
          {
            protocol: "reject",
            message: "Invalid protocol."
          }
        ))


    }

  });

});


app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);
    res.json({ message: "Successfully uploaded files" });
}

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});