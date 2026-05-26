import fs from 'fs';
import path from 'path';
import { User, DatasetMetadata } from '../models/types';

const DB_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface Schema {
  users: User[];
  metadata: DatasetMetadata[];
}

const defaultSchema: Schema = {
  users: [],
  metadata: []
};

// Check if running in a serverless environment like Vercel
const isServerless = process.env.VERCEL === '1' || !!process.env.VERCEL;

// In-memory fallback database for serverless environments
let memoryDb: Schema = { ...defaultSchema };

// Initialize DB file if not exists
const initDb = () => {
  if (isServerless) return;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultSchema, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Failed to initialize local DB file, falling back to in-memory db:', error);
  }
};

const readDb = (): Schema => {
  if (isServerless) {
    return memoryDb;
  }
  initDb();
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data) as Schema;
    }
    return defaultSchema;
  } catch (error) {
    console.error('Error reading JSON DB, resetting to default schema:', error);
    return defaultSchema;
  }
};

const writeDb = (data: Schema) => {
  if (isServerless) {
    memoryDb = data;
    return;
  }
  try {
    initDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to local DB file, falling back to in-memory db:', error);
    memoryDb = data;
  }
};

export const db = {
  getUsers: (): User[] => {
    return readDb().users;
  },
  saveUser: (user: User) => {
    const schema = readDb();
    schema.users.push(user);
    writeDb(schema);
  },
  getUserByEmail: (email: string): User | undefined => {
    return readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserByUsername: (username: string): User | undefined => {
    return readDb().users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },
  getMetadata: (): DatasetMetadata[] => {
    return readDb().metadata;
  },
  saveMetadata: (meta: DatasetMetadata) => {
    const schema = readDb();
    // Remove existing of same fileType if any
    schema.metadata = schema.metadata.filter(m => m.fileType !== meta.fileType);
    schema.metadata.push(meta);
    writeDb(schema);
  }
};
