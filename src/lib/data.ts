import connectDB from './db';
import Content from '@/models/Content';
import initialData from '@/data/content.json';

export async function getContent() {
    try {
        await connectDB();

        // Try to fetch from DB
        let content = await Content.findOne().lean();

        // If no content in DB, seed it from local JSON (imported statically)
        if (!content) {
            console.log('Database empty. Seeding from static JSON...');
            try {
                // Save to DB
                const newContent = new Content(initialData);
                await newContent.save();

                content = newContent.toObject();
                console.log('Seeding complete.');
            } catch (dbError) {
                console.error('Failed to seed from static JSON:', dbError);
                return null;
            }
        }

        // Return content (handling _id field)
        return content ? { ...content, _id: (content as any)._id.toString() } : null;

    } catch (error) {
        console.error('Error fetching content:', error);
        return null; // Handle gracefully in UI
    }
}

export async function saveContent(data: any) {
    try {
        await connectDB();

        // Update the single document (upsert=true ensures creation if missing)
        await Content.findOneAndUpdate({}, { ...data, updatedAt: new Date() }, { upsert: true, new: true });

        return true;
    } catch (error) {
        console.error('Error saving content:', error);
        return false;
    }
}
