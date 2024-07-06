import mongoose, { Schema, Document } from 'mongoose';

export interface IList {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isPublic: boolean;
  links: mongoose.Types.ObjectId[];
  editors: mongoose.Types.ObjectId[];
  subscribers: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  isPublic: { type: Boolean, default: false },
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListLink' }],
  editors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListEditor' }],
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListSubscriber' }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

ListSchema.index({ name: 1, creatorId: 1, isPublic: 1 }, { unique: true });
ListSchema.index({ name: 'text', description: 'text' });

export const List = mongoose.models.List || mongoose.model<IList>('List', ListSchema);
