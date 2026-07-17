const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  license: { type: String, required: true },
  vehicle: { type: String, required: true },
  status: { type: String, enum: ['online', 'busy', 'offline'], default: 'offline' },
  rating: { type: Number, default: 5.0 },
  totalRides: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Driver', driverSchema)