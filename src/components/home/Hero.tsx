import React from 'react';
import { getContent } from '@/lib/data';
import HeroClient from './HeroClient';

const Hero = async () => {
    const content = await getContent();
    const data = content?.hero || {
        title: "Building the Future with AI",
        subtitle: "Full-stack developer & AI enthusiast.",
        primaryCta: "View Projects",
        secondaryCta: "Contact Me"
    };

    return <HeroClient data={data} />;
};

export default Hero;
