import connectDB from './db';
import Content from '@/models/Content';
import initialData from '@/data/content.json';

export async function getContent() {
    try {
        console.log('[DEBUG] getContent: Starting...');
        await connectDB();
        console.log('[DEBUG] getContent: DB Connected');

        // Try to fetch from DB
        let content = await Content.findOne().lean();
        console.log('[DEBUG] getContent: Lookup result:', content ? 'Found' : 'Not Found');

        // If no content in DB, seed it from local JSON (imported statically)
        if (!content) {
            console.log('[DEBUG] Database empty. Seeding from static JSON...');
            try {
                // Save to DB
                console.log('[DEBUG] Creating new Content document...');
                const newContent = new Content(initialData);
                await newContent.save();
                console.log('[DEBUG] Save successful');

                content = newContent.toObject();
                console.log('[DEBUG] Seeding complete.');
            } catch (dbError) {
                console.error('[ERROR] Failed to seed from static JSON:', dbError);
                // Fallback to initialData from file if DB fails strict write but read might have worked? 
                // Actually if save fails, better to return initialData so site works read-only
                return { ...initialData, _id: 'fallback' };
            }
        }

        // Return content (handling _id field)
        const result = content ? { ...content, _id: (content as any)._id.toString() } : initialData;
        console.log('[DEBUG] Returning result keys:', Object.keys(result));
        return result;

    } catch (error) {
        console.error('[ERROR] Error fetching content:', error);
        // CRITICAL: Return initialData structure so frontend doesn't crash on .map()
        console.log('[WARN] Returning fallback static data due to error');
        return { ...initialData, _id: 'error-fallback' };
    }
}

export async function saveContent(data: any) {
    try {
        console.log('[DEBUG] saveContent: Starting...');
        await connectDB();

        // Update the single document (upsert=true ensures creation if missing)
        const result = await Content.findOneAndUpdate({}, { ...data, updatedAt: new Date() }, { upsert: true, new: true });
        console.log('[DEBUG] saveContent: Update successful', result?._id);

        return true;
    } catch (error) {
        console.error('[ERROR] Error saving content:', error);
        return false;
    }
}
