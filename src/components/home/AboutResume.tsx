import React from 'react';
import { getContent } from '@/lib/data';
import AboutResumeClient from './AboutResumeClient';

const AboutResume = async () => {
    const content = await getContent();
    const aboutData = content?.about || { title: "About", text1: "", text2: "", skills: [], image: "" };
    const resumeData = content?.resume || { summary: "", fileUrl: "" };

    return <AboutResumeClient aboutData={aboutData} resumeData={resumeData} />;
};

export default AboutResume;
