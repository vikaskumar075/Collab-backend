import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()


const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i
  return re.test(String(email).toLowerCase())
}


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

 
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists.' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ username, email, password: hashed })
  res.status(201).json({ message: 'User registered successfully' })
})


router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials.' })
  }

  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' })
  res.json({ token })
})

export default router
