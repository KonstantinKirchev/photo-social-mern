import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Posts from './postModel.js'
import Pusher from 'pusher'

//App Config
const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://KonstantinKirchev:mama2119@cluster0.qpfxhtj.mongodb.net/photoDB?retryWrites=true&w=majority'
const pusher = new Pusher({
    appId: "1541305",
    key: "d013fa8f05a31ca9c514",
    secret: "757eb8b7514305344d2b",
    cluster: "eu",
    useTLS: true
});

//Middleware
app.use(express.json())
app.use(Cors())

//DB Config
mongoose.set('strictQuery', true)
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
    console.log('DB Connected')
    const changeStream = mongoose.connection.collection('posts').watch()
    changeStream.on('change', change => {
        console.log(change)
        if(change.operationType === "insert") {
            console.log('Trigerring Pusher')
            pusher.trigger('posts','inserted', {
                change: change
            })
        } else {
            console.log('Error trigerring Pusher')
        }
    })
})

//API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"))

app.post('/upload', (req, res) => {
    const dbPost = req.body
    Posts.create(dbPost, (err, data) => {
        if(err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    })
})

app.get('/sync', (req, res) => {
    Posts.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))