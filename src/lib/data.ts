import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/data/content.json');

export async function getContent() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading content:', error);
        return null;
    }
}

export async function saveContent(content: any) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(content, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing content:', error);
        return false;
    }
}
