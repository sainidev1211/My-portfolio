import React from 'react';
import { getContent } from '@/lib/data';
import ResumeClient from './ResumeClient';

const Resume = async () => {
    const content = await getContent();
    const data = {
        summary: content?.resume?.summary || "Computer Science undergraduate specializing in Artificial Intelligence and Machine Learning at Chandigarh University. Passionate about AI & ML engineering, software development, Python architectures, and scalable full-stack applications.",
        fileUrl: content?.resume?.fileUrl || '/uploads/resume.pdf'
    };
    return <ResumeClient data={data} />;
};

export default Resume;
