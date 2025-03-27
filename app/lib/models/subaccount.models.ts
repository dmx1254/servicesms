// models/SubAccount.ts
import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface ISubAccount extends Document {
  owner: mongoose.Types.ObjectId | IUser;
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  phone?: string;
  role: "subaccount";
  permissions: {
    sendSms: boolean;
    viewReports: boolean;
  };
  smsCredits: number;
  companyName: string;
  smsCreditsUsed: number;
  isActive: boolean;
  lastActivity?: Date;
}

const subAccountSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      default: "subaccount",
      enum: ["subaccount"],
    },
    permissions: {
      sendSms: {
        type: Boolean,
        default: true,
      },
      viewReports: {
        type: Boolean,
        default: false,
      },
    },

    smsCredits: {
      type: Number,
      default: 0,
    },
    companyName: {
      type: String,
      required: true,
    },
    smsCreditsUsed: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
    },
  },
  { timestamps: true }
);

const SubAccountModel =
  mongoose.models.SubAccount ||
  mongoose.model<ISubAccount>("SubAccount", subAccountSchema);

export default SubAccountModel;
