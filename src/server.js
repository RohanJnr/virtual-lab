import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv'

dotenv.config()

const wss = new WebSocketServer({ port: 8080 });

const WebPassword = process.env.WEB_PASSWORD
const RoboPassword = process.env.ROBO_PASSWORD

console.log(WebPassword, RoboPassword)

const CONNECTIONS = {
  web: null,
  robo: null
}

const protocols = {

}


const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    console.log("Pinging all...")
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 5000);



let ROBO_STATE = "open"

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

      case "code":
        console.log(dataParsed)
        if (ws === CONNECTIONS.web) {
          console.log(dataParsed.code)
        }
        else {
          ws.send(JSON.stringify(
            {
              protocol: "reject",
              message: "You are not authorized to send code."
            }
          ))
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