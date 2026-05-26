import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'analyst' | 'user';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'User name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters.']
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address.'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required.'],
      select: false // Exclude from query outputs by default for security
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'analyst', 'user'],
        message: '{VALUE} is not a valid role.'
      },
      default: 'user'
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false }
  }
);

export const User = model<IUser>('User', UserSchema);
export default User;
