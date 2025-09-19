import User from '../models/user.model.mjs';

export async function listUsers(req, res) {
  const { q, role, limit = 20, page = 1 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  const docs = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit);
  res.json(docs);
}

export async function getUser(req, res) {
  const doc = await User.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'User not found' });
  res.json(doc);
}

export async function createUser(req, res) {
  try {
    const doc = await User.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function updateUser(req, res) {
  try {
    const doc = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'User not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function deleteUser(req, res) {
  const doc = await User.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: 'User not found' });
  res.json({ ok: true });
}