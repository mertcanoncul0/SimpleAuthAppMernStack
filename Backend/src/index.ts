import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './router'

const app = express()
const port = 8080

dotenv.config()

app.use(
  cors({
    credentials: true,
  })
)

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running is http://localhost:${port}/`)
})

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_URI)
mongoose.connection.on('error', (error: Error) => console.log(error))

app.use('/', router())
