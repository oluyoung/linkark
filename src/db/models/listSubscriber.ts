import mongoose, { Schema } from 'mongoose';

export interface IListSubscriber {
  _id: mongoose.Types.ObjectId;
  subscriberId: mongoose.Types.ObjectId;
  listId: mongoose.Types.ObjectId;
}

const ListSubscriberSchema: Schema = new Schema({
  subscriberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
}, { timestamps: true });

ListSubscriberSchema.index({ subscriberId: 1, listId: 1 }, { unique: true });

export const ListSubscriber = mongoose.models.ListSubscriber || mongoose.model<IListSubscriber>('ListSubscriber', ListSubscriberSchema);
