import mongoose, { Schema, Document, Model } from 'mongoose';

// Define loose schema to be flexible for future changes
const ContentSchema: Schema = new Schema({
    hero: { type: Schema.Types.Mixed, default: {} },
    about: { type: Schema.Types.Mixed, default: {} },
    projects: { type: [Schema.Types.Mixed], default: [] },
    resume: { type: Schema.Types.Mixed, default: {} },
    certifications: { type: [Schema.Types.Mixed], default: [] },
    socials: { type: [Schema.Types.Mixed], default: [] },
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

export interface IContent extends Document {
    hero: any;
    about: any;
    projects: any[];
    resume: any;
    certifications: any[];
    socials: any[];
    updatedAt: Date;
}

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
