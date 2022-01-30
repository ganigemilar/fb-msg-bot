const express = require("express")
const router = express.Router()
const client = require("axios")
const { default: axios } = require("axios")

const state = {
    user: {
        name: null,
        birthdate: null,
    },
    stepMessage: 0,
    resetStepMessage() {
        this.stepMessage = 0
    },
    isLastMessage() {
        return this.stepMessage == 4
    }
}

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const SEND_API_URL = `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`

router.post("/", async function (request, response) {
    let body = request.body

    if (!body)
        return response.status(404)

    replyMessageData = function() {
        data = {
            "messaging_type": "RESPONSE",
            "recipient": {
                "id": body.sender.id
            },
            "message": {
                "text": null
            }
        }

        if (!state.user.name)
            data.message.text = "Hi, what is your name?"
        else if (!state.user.birthdate)
            data.message.text = "What is your birthdate? please reply with format (YYYY-MM-DD)"
        else if (state.stepMessage == 3) {
            data.message.text = "Do you want to know how many days next your birthday?"
            state.stepMessage += 1
        } else if (state.isLastMessage()) {
            possAnswers = ["yes", "yeah", "yup", "no", "nah"]
            answer = body.message.text
            
            valid = false
            for (possAns of possAnswers) {
                valid = answer.toLocaleLowerCase().includes(possAns)
                if (valid) break
            }

            if (valid) {
                birthdate = new Date(state.user.birthdate)
                today = new Date()
                nextYear = new Date(`${today.getFullYear() + 1}-${birthdate.getMonth() + 1}-${birthdate.getDate()}`)
                rangeInDays = Math.round(Math.abs((nextYear - today) / (24 * 60 * 60 * 1000)))

                data.message.text = `There are ${rangeInDays} days left until your next birthday`
            } else
                data.message.text = "Goodbye 👋"
            state.resetStepMessage()
        }

        return data
    }

    if (state.stepMessage >= 1) {
        if (!state.user.name) {
            state.user.name = body.message.text
            state.stepMessage += 1
        } else if (!state.user.birthdate) {
            state.user.birthdate = body.message.text
            state.stepMessage += 1
        }
    } else {
        state.stepMessage += 1
    }

    msgData = replyMessageData()

    await axios.post(SEND_API_URL, msgData).then(res => {
        // console.log(res)
        console.log(msgData)
        console.log(state.user)
        response.status(200).send("EVENT RECEIVED")
    }).catch(err => {
        // console.error(err)
        response.status(500).send("FAILED")
    })

    // res.status(200).send("EVENT RECEIVED")
})

router.get("/", function (request, response) {

})

module.exports = router