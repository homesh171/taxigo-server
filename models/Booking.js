const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  passengers: { type: Number, required: true },
  flight: { type: String, default: '' },
  vehicle: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  // Guest fields
  isGuest: { type: Boolean, default: false },
  guestName: { type: String, default: '' },
  guestEmail: { type: String, default: '' },
  guestPhone: { type: String, default: '' },
  bookingReference: { type: String, sparse: true },
}, { timestamps: true })

// Auto generate booking reference
bookingSchema.pre('save', function () {
  if (!this.bookingReference) {
    this.bookingReference =
      'TG' +
      Date.now().toString().slice(-6) +
      Math.random().toString(36).slice(-3).toUpperCase();
  }
});

module.exports = mongoose.model('Booking', bookingSchema)