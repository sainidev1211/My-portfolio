import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug?: string;
  shortDescription?: string;
  description: string;

  image?: string;
  gallery?: string[];

  category: string;
  technologies: string[];

  liveUrl?: string;
  githubUrl?: string;

  featured: boolean;
  published: boolean;

  order: number;

  highlights: string[];

  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      required: false,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: false,
    },

    gallery: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: "Web",
    },

    technologies: {
      type: [String],
      default: [],
    },

    liveUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
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

    highlights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({
  title: "text",
  description: "text",
  technologies: "text",
});

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
