import React from 'react';
import { getContent } from '@/lib/data';
import CampusInvolvementClient from './CampusInvolvementClient';

export default async function CampusInvolvement() {
    const content = await getContent();
    const events = content?.campusInvolvement || [];
    return <CampusInvolvementClient initialEvents={events} />;
}
