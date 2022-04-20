
import express from 'express'
import path from 'path'
import { DATABASE_URL, HOST, PORT } from './config'
import { viewController } from './controllers'
import { connectDB } from './db'
import errorHandler from './middlewares/errorHandler'
import { router } from './routes'
const app = express()


global.APP_PATH = path.resolve()
app.use(express.urlencoded({extended:false}))


// connect to db
connectDB(DATABASE_URL)

//json middleware
app.use(express.json())

//upload file request
app.get('/uploads/:image', viewController.viewImage)

// router middleware
app.use('/api', router)

// error handler middleware
app.use(errorHandler)

app.listen(PORT, HOST, () => {
    console.log(`Listening on the Port : ${PORT}`) 
})
