const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const User = require('../models/User')
const auth = require('../middleware/auth')
const { sendBookingConfirmation, sendDriverAssigned } = require('../utils/email')

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, customer: req.user.id })
    
    // Send response FIRST, then send email in background
    res.json(booking)
    
    // Email in background - won't block response
    const customer = await User.findById(req.user.id)
    if (customer) {
      sendBookingConfirmation(customer.email, customer.name, booking)
        .catch(err => console.log('Email error:', err.message))
    }
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

    // Send response FIRST
    res.json(booking)

    // Email in background
    if (booking.customer) {
      sendDriverAssigned(
        booking.customer.email,
        booking.customer.name,
        booking,
        booking.driver
      ).catch(err => console.log('Driver email error:', err.message))
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
// Update status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, customer: req.user.id })
    
    const customer = await User.findById(req.user.id)
    console.log('Customer found:', customer?.email)
    
    if (customer) {
      try {
        await sendBookingConfirmation(customer.email, customer.name, booking)
        console.log('Email sent successfully!')
      } catch (emailError) {
        console.log('Email error:', emailError.message)
      }
    }
    
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router