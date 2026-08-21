import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ContentSchema = new mongoose.Schema({}, { strict: false });
const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

const EVENT_PHOTOS = [
    {
        id: 1787310000001,
        src: "/uploads/event1.jpg",
        alt: "Build for Bharat 2026",
        title: "Build for Bharat 2026",
        category: "National Hackathon",
        desc: "Built high-impact AI solutions solving real-world challenges with cutting-edge tech stack.",
        icon: "FaLaptopCode"
    },
    {
        id: 1787310000002,
        src: "/uploads/event2.jpg",
        alt: "ProtoPitch 2026",
        title: "ProtoPitch 2026",
        category: "Startup Pitching",
        desc: "Pitched innovative AI healthcare architecture to industry mentors and startup investors.",
        icon: "FaLightbulb"
    },
    {
        id: 1787310000003,
        src: "/uploads/event3.jpg",
        alt: "MindForge Hackathon",
        title: "MindForge Hackathon",
        category: "Innovation Challenge",
        desc: "Collaborative 36-hour sprint creating automated intelligent verification models.",
        icon: "FaTrophy"
    },
    {
        id: 1787310000004,
        src: "/uploads/event4.jpg",
        alt: "IGEN Green Commitment",
        title: "IGEN Green Commitment",
        category: "Campus Initiative",
        desc: "Active campus leadership advocating sustainable tech and youth-driven innovation.",
        icon: "FaUsers"
    }
];

const ACADEMIC_JOURNEY = [
    {
        id: 1787310000010,
        src: "/uploads/event1.jpg",
        alt: "Journey Placeholder 1"
    },
    {
        id: 1787310000011,
        src: "/uploads/event2.jpg",
        alt: "Journey Placeholder 2"
    },
    {
        id: 1787310000012,
        src: "/uploads/event3.jpg",
        alt: "Journey Placeholder 3"
    },
    {
        id: 1787310000013,
        src: "/uploads/event4.jpg",
        alt: "Journey Placeholder 4"
    }
];

async function seedCampusAndJourney() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        let content = await Content.findOne();
        if (!content) {
            content = new Content({});
        }

        if (!content.get('campusInvolvement') || content.get('campusInvolvement').length === 0) {
            console.log("Seeding campusInvolvement...");
            content.set('campusInvolvement', EVENT_PHOTOS);
        } else {
            console.log("campusInvolvement already has data. Skipping.");
        }

        if (!content.get('academicJourney') || content.get('academicJourney').length === 0) {
            console.log("Seeding academicJourney...");
            content.set('academicJourney', ACADEMIC_JOURNEY);
        } else {
            console.log("academicJourney already has data. Skipping.");
        }

        await content.save();
        console.log("Data saved successfully!");

    } catch (error) {
        console.error("Error seeding DB:", error);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected.");
    }
}

seedCampusAndJourney();
