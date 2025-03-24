import mongoose, { Document, Schema } from "mongoose";

interface UserBDLocation extends Document {
  userId: string;
  userDblocation: mongoose.Schema.Types.ObjectId;
  isActive: boolean;
  duration: number;
  createdAt: Date;
  expiresAt: Date;
}

const UserBDLocationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  userDblocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhoneDatabase",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  numberLimit: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
   
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Ajouter un index TTL sur le champ expiresAt
UserBDLocationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserBDLocationModel =
  mongoose.models.userbdlocation ||
  mongoose.model<UserBDLocation>("userbdlocation", UserBDLocationSchema);

export default UserBDLocationModel;
