import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const admin = searchParams.get("admin") === "true";
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};

    if (!admin) {
      query.published = true;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const projects = await Project.find(query)
      .sort({
        featured: -1,
        order: 1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("PROJECT_GET_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load projects.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.title || !body.slug || !body.description || !body.image) {
      return NextResponse.json(
        {
          success: false,
          message: "Required project fields are missing.",
        },
        {
          status: 400,
        }
      );
    }

    const project = await Project.create({
      title: body.title,
      slug: body.slug,
      shortDescription: body.shortDescription ?? "",
      description: body.description,
      image: body.image,
      gallery: body.gallery ?? [],
      category: body.category ?? "Web",
      technologies: body.technologies ?? [],
      liveUrl: body.liveUrl ?? "",
      githubUrl: body.githubUrl ?? "",
      featured: body.featured ?? false,
      published: body.published ?? true,
      order: body.order ?? 0,
      highlights: body.highlights ?? [],
    });

    return NextResponse.json(
      {
        success: true,
        project,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("PROJECT_CREATE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create project.",
      },
      {
        status: 500,
      }
    );
  }
}