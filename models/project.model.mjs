import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['planned', 'active', 'paused', 'completed'], default: 'planned' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', projectSchema);