// api/pods/route.js
import { NextResponse } from "next/server";

// In-memory data store
let pods = [];

export async function GET(request) {
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
}

export async function POST(request) {
  const { title } = await request.json();
  const newPod = createPod(title);
  return NextResponse.json(newPod, { status: 201 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const removed = removePodById(pods, id);
  const message = removed ? "Deleted" : "Pod not found";
  return NextResponse.json({ message }, { status: 200 });
}
