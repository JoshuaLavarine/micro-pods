// api/pods/route.js

// In memory data store
// In a more robust application, this would be replaced with a database in order to persist data between server restarts
let pods = [];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "5", 10);
  const sortBy = searchParams.get("sortBy") || "desc";

  const total = pods.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const sortedPods = [...pods].sort((a, b) => {
    if (sortBy === "asc") {
      return a.id - b.id;
    }
    return b.id - a.id;
  });
  const paginated = sortedPods.slice(start, end);

  return Response.json({ pods: paginated, total });
}

export async function POST(request) {
  const { title } = await request.json();
  const newPod = { id: pods.length + 1, title };
  pods.push(newPod);
  return Response.json(newPod, { status: 201 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  pods = pods.filter((pod) => pod.id !== id);
  return Response.json({ message: "Deleted" });
  pods = pods.filter((pod) => pod.id !== id);
  return Response.json({ message: "Deleted" });
}
