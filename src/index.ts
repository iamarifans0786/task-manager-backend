import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { ConnectionMongoDB } from './config/db'
import { AuthRouter } from './routes/auth.routes'
import { TaskRouter } from './routes/task.routes'

config()
const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }))


ConnectionMongoDB().then(() => {
    console.log('Database connected successfully');

    app.use('/api/auth', AuthRouter)
    app.use('/api/task', TaskRouter)


}).catch((error) => {
    console.log('Database connection failed:', error.message);
})




app.listen(process.env.port, () => {
    console.log(`Server is running on http://localhost:${process.env.port}`)
})

