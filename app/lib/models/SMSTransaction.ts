import { Schema, model, models, Types } from 'mongoose';

export interface ISMSTransaction {
  user: Types.ObjectId;
  type: 'purchase' | 'usage';
  amount: number;
  credits: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod?: string;
  paymentId?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const smsTransactionSchema = new Schema<ISMSTransaction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['purchase', 'usage'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentMethod: String,
  paymentId: String,
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const SMSTransaction = models.SMSTransaction || model<ISMSTransaction>('SMSTransaction', smsTransactionSchema); 