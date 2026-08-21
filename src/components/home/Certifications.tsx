import React from 'react';
import { getContent } from '@/lib/data';
import CertificationsClient from './CertificationsClient';

export default async function Certifications() {
    const content = await getContent();
    const certifications = content?.certifications || [];
    return <CertificationsClient initialCerts={certifications} />;
}
