import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  points: { type: Number, min: 0, default: 1 },
  dueDate: { type: Date },
  labels: { type: [String], default: [] },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignee: 1, dueDate: 1 });
taskSchema.index({ title: 'text' });

export default mongoose.model('Task', taskSchema);