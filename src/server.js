import express from 'express'
import mongoose from 'mongoose'
import 'colors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import instagramRoutes from './utils/routes/instagram.routes.js'
import threadsRoutes from './utils/routes/threads.routes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000
const db = ""


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use('/api/instagram', instagramRoutes)
app.use('/api/threads', threadsRoutes)


const connect = async () => {
    await mongoose.connect(db)
        .then(console.log('DB Connected'.italic.bgGreen))

    app.listen(port, () => {
        console.log(`Server run on port ${port}`.italic.bgBlue)
    })
}

connect()
