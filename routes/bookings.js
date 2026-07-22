const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const User = require('../models/User')
const auth = require('../middleware/auth')
const { sendBookingConfirmation, sendDriverAssigned } = require('../utils/email')

// Create booking (logged in customer)
router.post('/', auth, async (req, res) => {
  try {
    const booking = await Booking.create({ 
      ...req.body, 
      customer: req.user.id,
      isGuest: false
    })
    res.json(booking)
    User.findById(req.user.id).then(customer => {
      if (customer) sendBookingConfirmation(customer.email, customer.name, booking)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create guest booking (no auth required)
router.post('/guest', async (req, res) => {
  try {
    const { guestName, guestEmail, guestPhone, pickup, dropoff, date, time, passengers, flight, vehicle, price } = req.body
    const booking = await Booking.create({
      pickup, dropoff, date, time, passengers, flight, vehicle, price,
      guestName, guestEmail, guestPhone,
      isGuest: true,
      customer: null
    })
    res.json(booking)
    // Send confirmation email to guest
    sendBookingConfirmation(guestEmail, guestName, booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Find booking by reference + email (for guests)
router.post('/find', async (req, res) => {
  try {
    const { bookingReference, email } = req.body
    const booking = await Booking.findOne({
      bookingReference,
      $or: [
        { guestEmail: email },
        { customer: null }
      ]
    }).populate('driver', 'name phone')
    if (!booking) return res.status(404).json({ message: 'Booking not found! Check your reference and email.' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get all bookings (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer', 'name email phone').populate('driver', 'name phone')
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get my bookings (customer)
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get driver bookings
router.get('/driver', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user.id }).populate('customer', 'name phone')
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Assign driver (admin)
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { driver: req.body.driverId, status: 'confirmed' },
      { new: true }
    ).populate('customer', 'name email phone').populate('driver', 'name phone')
    res.json(booking)
    if (booking.customer) {
      sendDriverAssigned(booking.customer.email, booking.customer.name, booking, booking.driver)
    } else if (booking.guestEmail) {
      sendDriverAssigned(booking.guestEmail, booking.guestName, booking, booking.driver)
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router