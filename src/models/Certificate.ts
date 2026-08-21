import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  issuer: string;
  date: string;

  image: string;
  credentialUrl?: string;
  credentialId?: string;

  skills: string[];

  featured: boolean;
  published: boolean;

  order: number;

  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    credentialUrl: {
      type: String,
      default: "",
    },

    credentialId: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;