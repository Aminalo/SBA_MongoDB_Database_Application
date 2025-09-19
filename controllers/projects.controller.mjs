import Project from '../models/project.model.mjs';

export async function listProjects(req, res) {
  const { owner, status, member, limit = 20, page = 1 } = req.query;
  const filter = {};
  if (owner) filter.owner = owner;
  if (status) filter.status = status;
  if (member) filter.members = member;
  const docs = await Project.find(filter)
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit);
  res.json(docs);
}

export async function getProject(req, res) {
  const doc = await Project.findById(req.params.id).populate('owner', 'name email');
  if (!doc) return res.status(404).json({ error: 'Project not found' });
  res.json(doc);
}

export async function createProject(req, res) {
  try {
    const doc = await Project.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function updateProject(req, res) {
  try {
    const doc = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Project not found' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function deleteProject(req, res) {
  const doc = await Project.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Project not found' });
  res.json({ ok: true });
}