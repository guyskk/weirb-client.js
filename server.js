const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors({
    optionsSuccessStatus: 200,
    exposedHeaders: 'Service-Error'
}))
app.use(bodyParser.json())

const PORT = 43283

app.get('/echo/get', (req, res) => res.json({
    text: req.query.text
}))

app.post('/echo/post', (req, res) => res.json({
    text: req.body.text
}))

app.post('/echo/call', (req, res) => {
    let text = req.body.text
    if (text === 'error') {
        res.header('Service-Error', 'Echo.Error')
        res.status(400)
        res.json({
            message: 'echo error',
            data: text
        })
    } else {
        res.json({
            text: text
        })
    }
})


app.listen(
    PORT,
    () => console.log(`Echo server listening at http://127.0.0.1:${PORT}!`)
)