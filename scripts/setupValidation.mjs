import 'dotenv/config';
import mongoose from 'mongoose';

const dbName = process.env.DB_NAME || 'sba_db';

const validators = {
  users: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'email'],
        properties: {
          name: { bsonType: 'string', minLength: 2, maxLength: 120 },
          email: { bsonType: 'string', pattern: '^.+@.+\\..+$' },
          role: { enum: ['admin', 'manager', 'member'] }
        }
      }
    },
    validationAction: 'error'
  },
  projects: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'owner'],
        properties: {
          name: { bsonType: 'string' },
          description: { bsonType: ['string', 'null'] },
          status: { enum: ['planned', 'active', 'paused', 'completed'] },
          owner: { bsonType: 'objectId' },
          members: { bsonType: 'array', items: { bsonType: 'objectId' } }
        }
      }
    },
    validationAction: 'error'
  },
  tasks: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['title', 'project'],
        properties: {
          title: { bsonType: 'string' },
          status: { enum: ['todo', 'in-progress', 'done'] },
          points: { bsonType: 'number', minimum: 0 },
          dueDate: { bsonType: ['date', 'null'] },
          labels: { bsonType: 'array', items: { bsonType: 'string' } },
          project: { bsonType: 'objectId' },
          assignee: { bsonType: ['objectId', 'null'] }
        }
      }
    },
    validationAction: 'error'
  }
};

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');

  await mongoose.connect(uri, { dbName });
  const db = mongoose.connection.db;

  for (const [name, cfg] of Object.entries(validators)) {
    const exists = await db.listCollections({ name }).hasNext();
    if (!exists) {
      await db.createCollection(name, cfg);
      console.log(`Created collection with validation: ${name}`);
    } else {
      await db.command({ collMod: name, ...cfg });
      console.log(`Updated validation for: ${name}`);
    }
  }

  await mongoose.disconnect();
  console.log('Validation setup complete.');
}

main().catch(err => { console.error(err); process.exit(1); });