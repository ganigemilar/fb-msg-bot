const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const bodyParser = require("body-parser")

const app = express()

const SERVER_PORT = process.env.PORT || "8080"
app.listen(SERVER_PORT, function() {
    console.log("Server listening at : " + SERVER_PORT)
})

app.use(bodyParser.json(), bodyParser.urlencoded())
app.use("/webhook", require("./src/controllers/webhook.controller"))

