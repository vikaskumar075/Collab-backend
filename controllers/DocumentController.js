import Document from '../models/Document.js'

export const createDocument = async (req, res) => {
  const { title } = req.body
  const doc = await Document.create({
    title,
    content: '',
    versions: [],
    createdBy: req.user.id
  })
  res.json(doc)
}

export const getDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id)
  res.json(doc)
}

export const updateDocument = async (req, res) => {
  const { content } = req.body
  const doc = await Document.findById(req.params.id)
  doc.content = content
  doc.versions.push({ content, timestamp: new Date() })
  await doc.save()
  res.json(doc)
}

export const getVersions = async (req, res) => {
  const doc = await Document.findById(req.params.id)
  res.json(doc.versions)
}

export const restoreVersion = async (req, res) => {
  const doc = await Document.findById(req.params.id)
  const version = doc.versions[req.body.index]
  doc.content = version.content
  doc.versions.push({ content: version.content, timestamp: new Date() })
  await doc.save()
  res.json(doc)
}
