import Task from '../models/task.model.mjs';

export async function listTasks(req, res) {
  const { project, assignee, status, q, start, end, limit = 20, page = 1 } = req.query;
  const filter = {};
  if (project) filter.project = project;
  if (assignee) filter.assignee = assignee;
  if (status) filter.status = status;
  if (q) filter.$text = { $search: q };
  if (start || end) {
    filter.createdAt = {};
    if (start) filter.createdAt.$gte = new Date(start);
    if (end) filter.createdAt.$lte = new Date(end);
  }
  const docs = await Task.find(filter)
    .populate('assignee', 'name email')
    .populate('project', 'name')
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit);
  res.json(docs);
}

export async function getTask(req, res) {
  const doc = await Task.findById(req.params.id)
    .populate('assignee', 'name email')
    .populate('project', 'name');
  if (!doc) return res.status(404).json({ error: 'Task not found' });
  res.json(doc);
}

export async function createTask(req, res) {
  try {
    const doc = await Task.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function updateTask(req, res) {
  try {
    const doc = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Task not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function deleteTask(req, res) {
  const doc = await Task.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Task not found' });
  res.json({ ok: true });
}