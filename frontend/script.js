// call api to check if connection is available.
const passForm = document.getElementById("passForm")
const passInput = document.getElementById("passInput")
const messageBox = document.getElementById("message-box")
const message = document.getElementById("message")

const mainLogin = document.getElementById("main-login")
const codeArea = document.getElementById("code-area")

const runCodeBtn = document.getElementById("run-code")


let editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

const COLORS = {
    "red": "rgb(255, 109, 109)",
    "green": "rgb(42, 165, 108)"
}

const setMessage = (messageText, color) => {
    message.innerText = messageText
    messageBox.style.top = "20px"
    messageBox.style.background = color
    // messageBox.classList.add("animation-shrink")

    setTimeout(() => {
        messageBox.style.top = "-100px"
        messageBox.classList.remove("animation-shrink")
    }, 3000)
}



let socket = null;


const initEditor = () => {
    console.log("init code.")
    mainLogin.classList.add("hidden")
    codeArea.classList.remove("hidden")

    runCodeBtn.addEventListener("click", e => {
        console.log("Pressed.")
        if (socket) {
            socket.send(JSON.stringify({
                "protocol": "code",
                "code": editor.getValue()
            }))
        }
    })

}


passForm.addEventListener("submit", e => {
    e.preventDefault()
    const data = new FormData(passForm)
    const pass = data.get("password")

    socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    socket.addEventListener('open', (event) => {
        const connectJsonString = JSON.stringify({
            protocol: "connect",
            password: pass
        })
        socket.send(connectJsonString);
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
        const dataParsed = JSON.parse(event.data)

        switch (dataParsed.protocol) {
            case "reject":
                setMessage(dataParsed.message, COLORS.red)
                break

            case "connect":
                console.log("connected successfully")
                setMessage("Connected to server successfully!", COLORS.green)
                initEditor()
                break

            default:
                console.log(dataParsed)
        }
    });
})


export default socket