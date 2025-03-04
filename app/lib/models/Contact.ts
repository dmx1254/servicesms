import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
  },
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  telephone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true,
  },
  groupName: {
    type: String,
    required: [true, 'Le nom du groupe est requis'],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
