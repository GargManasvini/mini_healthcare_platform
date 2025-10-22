import express from 'express'
import { configDotenv } from 'dotenv'
import cors from 'cors'
import { connectDB } from './db/connection.js'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route.js'
import healthRoute from './routes/health.route.js'

const app = express()
configDotenv()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true // allow cookies
}));

const PORT = process.env.PORT || 5000

connectDB()

app.use('/api/auth', authRoute)
app.use('/api/health', healthRoute)
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})