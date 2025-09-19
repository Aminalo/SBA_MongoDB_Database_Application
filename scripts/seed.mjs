import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import User from '../models/user.model.mjs';
import Project from '../models/project.model.mjs';
import Task from '../models/task.model.mjs';

const dbName = process.env.DB_NAME || 'sba_db';

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { dbName });
  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);

  const users = JSON.parse(await fs.readFile(path.resolve('data/users.json')));
  const createdUsers = await User.insertMany(users);

  const projectsRaw = JSON.parse(await fs.readFile(path.resolve('data/projects.json')));
  const projects = projectsRaw.map((p, i) => ({
    ...p,
    owner: createdUsers[i % createdUsers.length]._id,
    members: createdUsers.map(u => u._id).slice(0, 4)
  }));
  const createdProjects = await Project.insertMany(projects);

  const tasksRaw = JSON.parse(await fs.readFile(path.resolve('data/tasks.json')));
  const tasks = tasksRaw.map((t, i) => ({
    ...t,
    project: createdProjects[i % createdProjects.length]._id,
    assignee: createdUsers[i % createdUsers.length]._id,
    dueDate: new Date(Date.now() + (i + 3) * 86400000)
  }));
  await Task.insertMany(tasks);

  console.log('Seeded:', {
    users: createdUsers.length,
    projects: createdProjects.length,
    tasks: tasks.length
  });

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });