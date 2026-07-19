const express = require('express')
const router = express.Router()
const Driver = require('../models/Driver')
const User = require('../models/User')
const auth = require('../middleware/auth')

// Get all drivers
router.get('/', auth, async (req, res) => {
  try {
    const drivers = await Driver.find().populate('user', 'name email phone')
    res.json(drivers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add driver
router.post('/', auth, async (req, res) => {
  try {
    const driver = await Driver.create(req.body)
    res.json(driver)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update driver status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(driver)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete driver
router.delete('/:id', auth, async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id)
    res.json({ message: 'Driver deleted!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router