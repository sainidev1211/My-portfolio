import React from 'react';
import { getContent } from '@/lib/data';
import ResumeClient from './ResumeClient';

const Resume = async () => {
    const content = await getContent();
    const data = content?.resume || { summary: '', fileUrl: '' };
    return <ResumeClient data={data} />;
}

export default Resume;
