import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    },
}, { timestamps: true });

// Prevent model recompilation error in development
export default mongoose.models.File || mongoose.model('File', FileSchema);
