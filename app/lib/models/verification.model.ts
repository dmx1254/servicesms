// lib/models/verification.model.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

interface VerificationCode extends Document {
  email: string;
  code: string;
  userData?: IUser;
  createdAt: Date;
  expiresAt: Date;
}

const verificationSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  userData: {
    type: Schema.Types.Mixed,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // Le document s'auto-supprime après 1 heure
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const VerificationModel =
  mongoose.models.Verification ||
  mongoose.model<VerificationCode>("Verification", verificationSchema);

export default VerificationModel;
