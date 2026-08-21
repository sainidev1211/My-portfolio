import React from 'react';
import { getContent } from '@/lib/data';
import AcademicJourneyClient from './AcademicJourneyClient';

export default async function AcademicJourney() {
    const content = await getContent();
    const photos = content?.academicJourney || [];
    return <AcademicJourneyClient initialPhotos={photos} />;
}
