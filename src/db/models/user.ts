import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified?: Date;
  createdAt: Date;
  links: mongoose.Types.ObjectId[];
  lists: mongoose.Types.ObjectId[];
  editingLists: mongoose.Types.ObjectId[];
  subscribedLists: mongoose.Types.ObjectId[];
  accounts: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  emailVerified: { type: Date },
  createdAt: { type: Date, default: Date.now },
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }],
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  editingLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListEditor' }],
  subscribedLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListSubscriber' }],
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
