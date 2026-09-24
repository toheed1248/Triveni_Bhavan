const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const healthRoutes = require('./routes/health')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const availabilityRoutes = require('./routes/availabilityRoutes')
const enquiryRoutes = require('./routes/enquiryRoutes')
const galleryRoutes = require('./routes/galleryRoutes')
const settingsRoutes = require('./routes/settingsRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB().catch(() => {
  console.log('Server running without MongoDB connection')
})

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp')
    }
  },
}))

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
