import mongoose, { Schema, Document } from 'mongoose';

export interface IListLink extends Document {
  _id: mongoose.Types.ObjectId;
  linkId: mongoose.Types.ObjectId;
  listId: mongoose.Types.ObjectId;
}

const ListLinkSchema: Schema = new Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
}, { timestamps: true });

ListLinkSchema.index({ linkId: 1, listId: 1 }, { unique: true });

export const ListLink = mongoose.models.ListLink || mongoose.model<IListLink>('ListLink', ListLinkSchema);
