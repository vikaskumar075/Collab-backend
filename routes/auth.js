import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10)
  const user = await User.create({ ...req.body, password: hashed })
  res.json(user)
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const match = await bcrypt.compare(req.body.password, user?.password || '')
  if (match) {
    const token = jwt.sign({ id: user._id }, 'secret')
    res.json({ token })
  } else {
    res.status(401).send('Invalid')
  }
})

export default router
