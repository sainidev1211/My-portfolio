import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/contacts.json');

export async function getContacts() {
    if (!fs.existsSync(dataPath)) {
        return [];
    }
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    try {
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

export async function saveContact(contact: any) {
    const contacts = await getContacts();
    contacts.push({ ...contact, id: Date.now(), date: new Date().toISOString() });

    // Ensure directory exists
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
    return true;
}
