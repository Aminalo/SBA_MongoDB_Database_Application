import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, match: /.+@.+\..+/ },
  role: { type: String, enum: ['admin', 'manager', 'member'], default: 'member' },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', userSchema);