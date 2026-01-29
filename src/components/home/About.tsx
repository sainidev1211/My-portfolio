import React from 'react';
import { getContent } from '@/lib/data';
import AboutClient from './AboutClient';

const About = async () => {
    const content = await getContent();
    const data = content?.about || {
        title: "About Me",
        text1: "Welcome",
        text2: "Description",
        skills: [],
        image: ''
    };
    return <AboutClient data={data} />;
}

export default About;
