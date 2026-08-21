"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Projects.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaSearch, FaTimes, FaStar, FaCode, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ProjectsProps {
    projects?: any[];
}

const FILTERS = ["All", "Full Stack", "AI/ML", "Healthcare", "Web"];

export default function ProjectsClient({ projects: initialProjects }: ProjectsProps) {
    const [projs, setProjs] = useState<any[]>(initialProjects || []);
    const [isLoading, setIsLoading] = useState(!initialProjects?.length);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!initialProjects?.length) {
            setIsLoading(true);
            fetch('/api/content')
                .then(res => res.json())
                .then(data => setProjs(data.projects || []))
                .catch(err => console.error("Failed to load projects", err))
                .finally(() => setIsLoading(false));
        }
    }, [initialProjects]);

    // Client-side filtering
    const filteredProjects = projs.filter(project => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const titleMatch = (project.title || '').toLowerCase().includes(query);
            const descMatch = (project.description || '').toLowerCase().includes(query);
            const tagMatch = project.tags?.some((t: string) => t.toLowerCase().includes(query));
            if (!titleMatch && !descMatch && !tagMatch) return false;
        }
        if (activeFilter === "All") return true;
        const fl = activeFilter.toLowerCase();
        if (project.category?.toLowerCase().includes(fl)) return true;
        const tagHit = project.tags?.some((t: string) => {
            const tl = t.toLowerCase();
            if (fl === 'ai/ml') return tl.includes('ai') || tl.includes('ml') || tl.includes('machine') || tl.includes('deep');
            if (fl === 'web') return tl.includes('web') || tl.includes('react') || tl.includes('next');
            return tl.includes(fl);
        });
        if (tagHit) return true;
        const title = (project.title || '').toLowerCase();
        const desc = (project.description || '').toLowerCase();
        if (fl === 'ai/ml') return title.includes('ai') || desc.includes('ai') || title.includes('ml');
        return title.includes(fl) || desc.includes(fl);
    });

    // Duplicate for marquee-style infinite scroll
    const displayProjects = filteredProjects.length > 0
        ? [...filteredProjects, ...filteredProjects]   // duplicate for seamless loop
        : [];

    const isFiltered = searchQuery.trim() || activeFilter !== "All";

    // Manual scroll arrows
    const scroll = useCallback((dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = 340;
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    }, []);

    return (
        <section id="projects" className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.eyebrow}>&lt; projects /&gt;</span>
                    <h2 className={styles.title}>Featured Projects</h2>
                    <p className={styles.subtext}>Production apps, AI systems & full-stack platforms by Dev Saini</p>
                </div>

                {/* Controls Bar */}
                <div className={styles.controlsRow}>
                    <div className={styles.searchWrapper}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by tech, title, or feature..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className={styles.clearSearchBtn}>
                                <FaTimes size={11} />
                            </button>
                        )}
                    </div>

                    <div className={styles.filterContainer}>
                        {FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`${styles.filterBtn} ${activeFilter === filter ? styles.filterBtnActive : ''}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className={styles.sliderNavButtons}>
                        <button className={styles.navArrowBtn} onClick={() => scroll('left')} aria-label="Previous">
                            <FaChevronLeft size={11} />
                        </button>
                        <button className={styles.navArrowBtn} onClick={() => scroll('right')} aria-label="Next">
                            <FaChevronRight size={11} />
                        </button>
                    </div>
                </div>

                {/* Slider Outer */}
                <div className={styles.sliderOuterWrapper}>
                    <div className={styles.fadeLeft} />
                    <div className={styles.fadeRight} />

                    {isLoading ? (
                        <div className={styles.sliderScrollContainer} ref={scrollRef}>
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className={styles.skeletonCard}>
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonContent}>
                                        <div className={styles.skeletonTitle} />
                                        <div className={styles.skeletonDesc} />
                                        <div className={styles.skeletonTags}>
                                            <div className={styles.skeletonTag} />
                                            <div className={styles.skeletonTag} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className={styles.noResults}>
                            <p>No projects found matching "{searchQuery || activeFilter}".</p>
                            <button
                                onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
                                className={styles.resetBtn}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        // When filtered, use a simple scrollable row; when unfiltered, use marquee
                        isFiltered ? (
                            <div className={styles.sliderScrollContainer} ref={scrollRef}>
                                {filteredProjects.map((project, idx) => (
                                    <ProjectCard key={`${project.id}-${idx}`} project={project} onSelect={setSelectedProject} />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.sliderScrollContainer} ref={scrollRef}>
                                <div className={styles.marqueeTrack}>
                                    {displayProjects.map((project, idx) => (
                                        <ProjectCard key={`${project.id}-${idx}`} project={project} onSelect={setSelectedProject} />
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Quick Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalBackdrop}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className={styles.modalWindow}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalImageHeader}>
                                {selectedProject.image ? (
                                    <img src={selectedProject.image} alt={selectedProject.title} className={styles.modalImg} />
                                ) : (
                                    <div className={styles.placeholderImg}>Project Preview</div>
                                )}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className={styles.modalCloseBtn}
                                >
                                    <FaTimes size={14} />
                                </button>
                            </div>

                            <div className={styles.modalContent}>
                                <div className={styles.modalTitleRow}>
                                    <h3 className={styles.modalTitle}>{selectedProject.title}</h3>
                                    {selectedProject.category && (
                                        <span className={styles.categoryBadge}>{selectedProject.category}</span>
                                    )}
                                </div>

                                <p className={styles.modalDesc}>{selectedProject.description}</p>

                                {selectedProject.highlights?.length > 0 && (
                                    <div className={styles.modalSection}>
                                        <h4 className={styles.modalSectionTitle}>Key Highlights</h4>
                                        <ul className={styles.modalHighlights}>
                                            {selectedProject.highlights.map((h: string, idx: number) => (
                                                <li key={idx}>{h}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedProject.tags?.length > 0 && (
                                    <div className={styles.modalSection}>
                                        <h4 className={styles.modalSectionTitle}>Technologies</h4>
                                        <div className={styles.tags}>
                                            {selectedProject.tags.map((tag: string) => (
                                                <span key={tag} className={styles.tag}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.modalFooterActions}>
                                    {selectedProject.githubUrl && (
                                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryModalLink}>
                                            <FaGithub size={15} /> View on GitHub
                                        </a>
                                    )}
                                    {selectedProject.link && (
                                        <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className={styles.secondaryModalLink}>
                                            <FaExternalLinkAlt size={12} /> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// ─── Reusable compact project card ───────────────────────────────────────────
function ProjectCard({ project, onSelect }: { project: any; onSelect: (p: any) => void }) {
    return (
        <div className={styles.compactCard}>
            {/* Image */}
            <div className={styles.imageArea} onClick={() => onSelect(project)}>
                {project.image ? (
                    <img src={project.image} alt={project.title} className={styles.image} />
                ) : (
                    <div className={styles.placeholderImg}>
                        <FaCode size={20} style={{ opacity: 0.35, marginBottom: '6px' }} />
                        <span>No Preview</span>
                    </div>
                )}
                {project.featured && (
                    <div className={styles.featuredBadge}>
                        <FaStar size={9} /> Featured
                    </div>
                )}
                <div className={styles.overlay} onClick={() => onSelect(project)}>
                    <span className={styles.overlayLinkText}>Quick Overview ↗</span>
                </div>
            </div>

            {/* Content */}
            <div className={styles.contentArea}>
                <div className={styles.titleRow}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    {project.category && <span className={styles.categoryBadge}>{project.category}</span>}
                </div>

                <p className={styles.cardDesc}>{project.description}</p>

                <div className={styles.tags}>
                    {project.tags?.slice(0, 4).map((tag: string) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.actionLinks}>
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                                <FaGithub size={13} /><span>Code</span>
                            </a>
                        )}
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                                <FaExternalLinkAlt size={11} /><span>Live</span>
                            </a>
                        )}
                    </div>
                    <button onClick={() => onSelect(project)} className={styles.detailsBtn}>
                        Details →
                    </button>
                </div>
            </div>
        </div>
    );
}
