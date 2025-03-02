import mongoose, { Document } from "mongoose";

interface IContact {
  firstname: string;
  lastname: string;
  phone: string;
  status?: "sent" | "delivered" | "failed";
  errorMessage?: string;
}

interface ICampaign extends Document {
  id: string;
  userId: string;
  name: string;
  type: "academic" | "marketing" | "transactional";
  status: "draft" | "scheduled" | "sent" | "failed";
  message: string;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  scheduledDate?: Date;
  contacts: IContact[];
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema<IContact>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ["sent", "delivered", "failed"],
    default: undefined,
  },
  errorMessage: String,
});

const campaignSchema = new mongoose.Schema<ICampaign>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["academic", "marketing", "transactional"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sent", "failed"],
      default: "draft",
      index: true,
    },
    message: { type: String, required: true },
    recipientCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    scheduledDate: Date,
    contacts: [contactSchema],
  },
  {
    timestamps: true,
  }
);

// Convertir _id en id
campaignSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc: Document, ret: Record<string, unknown>) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const CampaignModel = mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", campaignSchema);

export type { ICampaign, IContact };
export default CampaignModel;