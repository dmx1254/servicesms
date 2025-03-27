import mongoose, { Document, Schema } from "mongoose";

interface INVOICE extends Document {
  userId: mongoose.Types.ObjectId;
  smsQuantity: number;
  completedPaymentDate: string;
  id: string;
  paymentId: string;
  transactionId: string;
  price: number;
  currency: string;
  bussinessName: string;
  checkoutStatus: string;
  paymentStatus: string;
  whenCompleted: string;
}

const invoiceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    smsQuantity: {
      type: Number,
      required: true,
    },
    completedPaymentDate: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    bussinessName: {
      type: String,
      required: true,
    },
    checkoutStatus: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    whenCompleted: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const InvoiceModel =
  mongoose.models.invoice || mongoose.model<INVOICE>("Invoice", invoiceSchema);

export default InvoiceModel;
