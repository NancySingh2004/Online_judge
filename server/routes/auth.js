const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) return res.status(400).json({ msg: 'Username already taken' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ msg: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ msg: 'Invalid username' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.json({ token })
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
