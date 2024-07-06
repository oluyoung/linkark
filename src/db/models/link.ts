import mongoose, { Schema } from 'mongoose';

export interface ILink {
  readonly _id: mongoose.Types.ObjectId;
  hostname: string;
  origin: string;
  path: string;
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  query?: string;
  rawUrl: string;
  rawUrlHash: string;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  creator: mongoose.Types.ObjectId;
}

const LinkSchema: Schema = new Schema({
  hostname: { type: String, required: true },
  origin: { type: String, required: true },
  path: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  ogTitle: { type: String },
  ogDescription: { type: String },
  ogType: { type: String },
  ogUrl: { type: String },
  query: { type: String },
  rawUrl: { type: String, required: true },
  rawUrlHash: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

LinkSchema.index({ hostname: 1, origin: 1 });
LinkSchema.index({ title: 'text', description: 'text', ogDescription: 'text', ogTitle: 'text', rawUrl: 'text' });

export const Link = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);
