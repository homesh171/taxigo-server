const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err))

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/bookings', require('./routes/bookings.js'))
app.use('/api/drivers', require('./routes/drivers.js'))

app.get('/', (req, res) => res.send('TaxiGo Server Running!'))

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})