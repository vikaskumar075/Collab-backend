import express from 'express'
import {
  createDocument,
  getDocument,
  updateDocument,
  getVersions,
  restoreVersion
} from '../controllers/DocumentController.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).send('Missing token')
  try {
    const decoded = jwt.verify(token, 'secret')
    req.user = decoded
    next()
  } catch {
    res.status(401).send('Invalid token')
  }
}

router.post('/create', auth, createDocument)
router.get('/:id', auth, getDocument)
router.put('/:id', auth, updateDocument)
router.get('/version/:id', auth, getVersions)
router.post('/version/restore/:id', auth, restoreVersion)

export default router
