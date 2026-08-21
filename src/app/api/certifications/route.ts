import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

/**
 * GET /api/certifications
 * Returns all published Certificate documents from the `certificates` collection,
 * sorted by `order` ascending then by `createdAt` descending.
 * This is the ONLY endpoint the Certifications & Badges frontend section should use.
 * It does NOT touch the Content document or the projects collection.
 */
export async function GET() {
    try {
        await connectDB();

        const certs = await Certificate.find({ published: true })
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, certifications: certs });
    } catch (error) {
        console.error("[ERROR] GET /api/certifications:", error);
        return NextResponse.json(
            { success: false, certifications: [], message: "Failed to load certifications." },
            { status: 500 }
        );
    }
}
