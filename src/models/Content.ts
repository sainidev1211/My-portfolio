import mongoose, { Schema, Document, Model } from 'mongoose';

// Define loose schema to be flexible for future changes
const ContentSchema: Schema = new Schema({
    hero: { type: Schema.Types.Mixed, default: {} },
    about: { type: Schema.Types.Mixed, default: {} },
    experience: { type: [Schema.Types.Mixed], default: [] },
    projects: { type: [Schema.Types.Mixed], default: [] },
    resume: { type: Schema.Types.Mixed, default: {} },
    certifications: { type: [Schema.Types.Mixed], default: [] },
    campusInvolvement: { type: [Schema.Types.Mixed], default: [] },
    academicJourney: { type: [Schema.Types.Mixed], default: [] },
    knowledgeFiles: { type: [Schema.Types.Mixed], default: [] },
    aiKnowledge: { type: [Schema.Types.Mixed], default: [] },
    socials: { type: [Schema.Types.Mixed], default: [] },
    contactInfo: { type: Schema.Types.Mixed, default: {} },
    updatedAt: { type: Date, default: Date.now }
}, { strict: false });

export interface IContent extends Document {
    hero: any;
    about: any;
    experience: any[];
    projects: any[];
    resume: any;
    certifications: any[];
    campusInvolvement: any[];
    academicJourney: any[];
    knowledgeFiles: any[];
    aiKnowledge: any[];
    socials: any[];
    contactInfo: any;
    updatedAt: Date;
}

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
