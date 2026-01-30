import connectDB from './db';
import Contact from '@/models/Contact';

export async function getContacts() {
    try {
        await connectDB();
        // Convert documents to plain objects to avoid serialization issues
        const contacts = await Contact.find({}).sort({ date: -1 }).lean();

        // Map _id to id string if needed (frontend uses .id)
        return contacts.map((c: any) => ({
            ...c,
            id: c._id.toString(),
            date: c.date.toISOString()
        }));
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
}

export async function saveContact(data: any) {
    try {
        await connectDB();
        const contact = new Contact(data);
        await contact.save();
        return true;
    } catch (error) {
        console.error('Error saving contact:', error);
        throw error;
    }
}
