import mongoose from 'mongoose';
import Task from '../models/task.model.mjs';

function toObjectId(id) {
  try { return new mongoose.Types.ObjectId(id); } catch { return null; }
}

export async function tasksByStatus(req, res) {
  const match = {};
  if (req.query.project) {
    const oid = toObjectId(req.query.project);
    if (oid) match.project = oid;
  }
  const pipeline = [
    { $match: match },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
    { $sort: { count: -1 } }
  ];
  const data = await Task.aggregate(pipeline);
  res.json(data);
}

export async function velocityByWeek(req, res) {
  const match = {};
  if (req.query.project) {
    const oid = toObjectId(req.query.project);
    if (oid) match.project = oid;
  }
  const pipeline = [
    { $match: match },
    { $group: {
        _id: { year: { $isoWeekYear: '$createdAt' }, week: { $isoWeek: '$createdAt' } },
        points: { $sum: '$points' }
    }},
    { $project: { _id: 0, year: '$_id.year', week: '$_id.week', points: 1 } },
    { $sort: { year: 1, week: 1 } }
  ];
  const data = await Task.aggregate(pipeline);
  res.json(data);
}

export async function topContributors(req, res) {
  const limit = Number(req.query.limit || 5);
  const pipeline = [
    { $match: { status: 'done' } },
    { $group: { _id: '$assignee', totalPoints: { $sum: '$points' }, tasks: { $sum: 1 } } },
    { $sort: { totalPoints: -1 } },
    { $limit: limit }
  ];
  const data = await Task.aggregate(pipeline);
  res.json(data);
}