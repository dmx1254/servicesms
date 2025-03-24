import mongoose, { Schema, Document } from "mongoose";

interface IPHONE {
  prenom: string;
  nom: string;
  telephone: string;
  region?: string;
}

enum Category {
  PARTICULIERS = "particuliers",
  ENTREPRISES = "entreprises",
  ETUDIANTS = "etudiants",
  COMMERCANTS = "commercants",
  MARKETING = "marketing",
  TRANSACTIONNELS = "transactionnels",
  ARTISANS = "artisans",
  AUTRES = "autres",
}

interface PhoneData extends Document {
  name: string;
  category: Category;
  qualityScore: number;
  isAvailable: boolean;
  lastUpdated: Date;
  phones: IPHONE[];
}

const phoneSchema = new Schema({
  prenom: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: false,
  },
});

const phoneDatabaseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "particuliers",
        "entreprises",
        "etudiants",
        "commercants",
        "marketing",
        "transactionnels",
        "artisans",
        "autres",
      ],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 95,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    phones: {
      type: [phoneSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PhoneDatabase =
  mongoose.models.PhoneDatabase ||
  mongoose.model<PhoneData>("PhoneDatabase", phoneDatabaseSchema);

export default PhoneDatabase;
