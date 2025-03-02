import { Schema, model, models } from 'mongoose';

export interface ISMSPackage {
  name: string;
  credits: number;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  validityDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const smsPackageSchema = new Schema<ISMSPackage>({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    unique: true,
  },
  credits: {
    type: Number,
    required: [true, 'Number of credits is required'],
    min: 1,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  features: [{
    type: String,
    required: true,
  }],
  isPopular: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  validityDays: {
    type: Number,
    required: true,
    default: 365,
  },
}, {
  timestamps: true,
});

export const SMSPackage = models.SMSPackage || model<ISMSPackage>('SMSPackage', smsPackageSchema); 