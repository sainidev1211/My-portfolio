import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: Context
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load project.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    const project = await Project.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("PROJECT_UPDATE_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update project.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: Context
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete project.",
      },
      {
        status: 500,
      }
    );
  }
}