/**
 * seed-certs.mjs
 * Seeds the local MongoDB's Content document with the 14 certificates
 * extracted from the deployed portfolio at devsaini.vercel.app
 *
 * Run once with:  node scripts/seed-certs.mjs
 */

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI not found in .env.local");
    process.exit(1);
}

// ─── Certificates scraped from https://devsaini.vercel.app/api/content ──────
const CERTS = [
    {
        id: 1769942561372,
        title: "Academic Research Foundations: Quantitative",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Productivity Tools",
        link: "https://www.linkedin.com/learning/certificates/cf0b779ce9feffd6e86b1040db46d399435e25f6e7d99f2d630ed6b739dc1f1f?u=92961692",
        image: "https://devsaini.vercel.app/api/files/69dc88cbc387eadba83fee1b", // fallback remote URL
    },
    {
        id: 1769942661314,
        title: "Python for Data Science, AI & Development",
        issuer: "IBM",
        date: "2025",
        category: "AI",
        link: "https://www.coursera.org/account/accomplishments/verify/QGJPSRAUNQLL",
        image: "https://devsaini.vercel.app/api/files/697f81b3636857c0d0a520e0",
    },
    {
        id: 1769964319923,
        title: "Microsoft Excel",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Data Analysis",
        link: "https://www.linkedin.com/learning/certificates/41aa3a8d9dff04db65d615fc5f61f7ee25eebfdb017c176ec1f05d39175c7a2b?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f837a636857c0d0a520f7",
    },
    {
        id: 1769964631236,
        title: "PowerPoint Essential Training (Microsoft 365)",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Productivity Tools",
        link: "https://www.linkedin.com/learning/certificates/ea9c69aab777b61d26ecde9ce1a60d7efe9a781a64c1a50713d8bf6010937cd7?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f8451636857c0d0a520fd",
    },
    {
        id: 1769965094525,
        title: "Excel: Introduction to Formatting",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Data Analysis",
        link: "https://www.linkedin.com/learning/certificates/1c316b4db2d1d1e44d11370f40a0931b5bd5bef8a1f6e204c53034a47b492959?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f8621abb1b6d7da7906ca",
    },
    {
        id: 1769965211438,
        title: "Excel Essential Training (Microsoft 365)",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Data Analysis",
        link: "https://www.linkedin.com/learning/certificates/efca32ea5a7cc48a9030d2bf7fdb85fba58957859ff56ae5214bd0820fafbead?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f8693abb1b6d7da7906d0",
    },
    {
        id: 1769965284409,
        title: "Excel: Introduction to Formulas and Functions",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Data Analysis",
        link: "https://www.linkedin.com/learning/certificates/b18dc6ebaa97908c1cba3db98cd5e15b57baef578e8a1fb46a3e793562e92f2c?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f86deabb1b6d7da7906d6",
    },
    {
        id: 1769965365234,
        title: "Excel Formulas and Functions Quick Tips",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Data Analysis",
        link: "https://www.linkedin.com/learning/certificates/5fa13b3d301f69a2b7d153d0fdc35dbc638e4b97924ef1dbb1058b41df4c7794?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f8731abb1b6d7da7906dc",
    },
    {
        id: 1769965464272,
        title: "Excel: PivotTables for Beginners",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Productivity Tools",
        link: "https://www.linkedin.com/learning/certificates/68acb8e690b1af410a2ef9af2689d44c3c7f63fae7e897573a25311f1831a7ba?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f8793abb1b6d7da7906e2",
    },
    {
        id: 1769965548408,
        title: "Excel PivotTable Quick Tips",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Data Analysis",
        link: "https://www.linkedin.com/learning/certificates/dd2374477cf39eecebe8eabbb0bc2cfc4e45badf24879828a3433ec8718fb073?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f87e7abb1b6d7da7906e8",
    },
    {
        id: 1769965649165,
        title: "PowerPoint: Designing Better Slides",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Productivity Tools",
        link: "https://www.linkedin.com/learning/certificates/3efdc929e3c092bf3ae7eb927a77bd97c659bf4c08516871392fd94b8a6a367b?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f884babb1b6d7da7906ee",
    },
    {
        id: 1769965765023,
        title: "MS Word Quick Tips",
        issuer: "Linkedin Learning",
        date: "2025",
        category: "Productivity Tools",
        link: "https://www.linkedin.com/learning/certificates/f4e6cf2a1a8490239f6ea8390d41d9c9f426e54415037c5ba2e3dc3962a624d5?trk=share_certificate",
        image: "https://devsaini.vercel.app/api/files/697f88c0abb1b6d7da7906f4",
    },
    {
        id: 1769965907657,
        title: "Mathematics for Machine Learning: Linear Algebra",
        issuer: "Coursera",
        date: "2025",
        category: "Machine Learning",
        link: "https://www.coursera.org/account/accomplishments/verify/CY4VIPIH8HLU",
        image: "https://devsaini.vercel.app/api/files/697f894eabb1b6d7da7906fa",
    },
    {
        id: 1775121881475,
        title: "Prompt Engineering",
        issuer: "Coursera",
        date: "2026",
        category: "Machine Learning",
        link: "https://www.coursera.org/account/accomplishments/specialization/GZ7SZQW4580A",
        image: "https://devsaini.vercel.app/api/files/69ce35d2946be674b7e4d8fa",
    },
];

async function seed() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log("✅  Connected to MongoDB");

        const db = client.db();
        const col = db.collection("contents");

        // Upsert the Content document — set certifications array
        const result = await col.updateOne(
            {},
            {
                $set: {
                    certifications: CERTS,
                    updatedAt: new Date(),
                },
            },
            { upsert: true }
        );

        console.log(`✅  Certifications seeded successfully.`);
        console.log(`   Matched: ${result.matchedCount}  Modified: ${result.modifiedCount}  Upserted: ${result.upsertedCount}`);
        console.log(`   Total certificates written: ${CERTS.length}`);
    } catch (err) {
        console.error("❌  Seed error:", err);
    } finally {
        await client.close();
        console.log("✅  Connection closed.");
    }
}

seed();
