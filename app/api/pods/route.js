import { NextResponse } from "next/server";
import {
  createPod,
  removePodById,
  paginateAndSortPods,
} from "./responseHelpers";

// In-memory data store
let pods = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
    const sortBy = searchParams.get("sortBy") || "desc";

    const { paginated, total } = paginateAndSortPods(
      pods,
      page,
      pageSize,
      sortBy
    );

    return NextResponse.json({ pods: paginated, total });
  } catch (error) {
    console.error("Error in GET /api/pods:", error);
    return NextResponse.json(
      { error: "Failed to fetch pods. Please try again later." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title } = await request.json();
    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }
    const newPod = createPod(pods, title);
    return NextResponse.json(
      { pod: newPod, total: pods.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/pods:", error);
    return NextResponse.json(
      { error: "Failed to create pod. Please try again later." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Pod ID is required." },
        { status: 400 }
      );
    }
    const removed = removePodById(pods, id);
    const message = removed ? "Deleted" : "Pod not found";
    return NextResponse.json({ message, total: pods.length }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/pods:", error);
    return NextResponse.json(
      { error: "Failed to delete pod. Please try again later." },
      { status: 500 }
    );
  }
}
