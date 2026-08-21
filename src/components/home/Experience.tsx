import React from 'react';
import { getContent } from '@/lib/data';
import ExperienceClient from './ExperienceClient';

export default async function Experience() {
    const content = await getContent();
    const experienceData = content?.experience || [];

    return <ExperienceClient initialExperience={experienceData} />;
}
