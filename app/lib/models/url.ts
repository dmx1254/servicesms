// /app/lib/models/url.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IURL extends Document {
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const UrlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already compiled to avoid overwriting
const UrlModel = mongoose.models.Url || mongoose.model<IURL>("Url", UrlSchema);
export default UrlModel;