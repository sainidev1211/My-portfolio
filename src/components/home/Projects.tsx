import React from 'react';
import { getContent } from '@/lib/data';
import ProjectsClient from './ProjectsClient';

const Projects = async () => {
    const content = await getContent();
    const projects = content?.projects || [];
    return <ProjectsClient projects={projects} />;
}

export default Projects;
