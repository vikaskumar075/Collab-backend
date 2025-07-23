import mongoose from 'mongoose'

const versionSchema = new mongoose.Schema({
  content: String,
  timestamp: Date
})

const docSchema = new mongoose.Schema({
  title: String,
  content: String,
  versions: [versionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model('Document', docSchema)
