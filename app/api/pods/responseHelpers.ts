import { Pod, PaginatedPods } from "../../types";

export function paginateAndSortPods(
  pods: Pod[],
  page: number,
  pageSize: number,
  sortBy: string
): PaginatedPods {
  const total = pods.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const sortedPods = [...pods].sort((a, b) =>
    sortBy === "oldestFirst" ? a.id - b.id : b.id - a.id
  );
  const paginated = sortedPods.slice(start, end);
  return { pods: paginated, total };
}

export function createPod(
  pods: Pod[],
  counter: { value: number },
  title: string
): Pod {
  const newPod: Pod = { id: counter.value, title };
  pods.push(newPod);
  counter.value++;
  return newPod;
}

export function removePodById(podsArray: Pod[], id: number): boolean {
  const index = podsArray.findIndex((pod) => pod.id === id);
  if (index !== -1) {
    podsArray.splice(index, 1);
    return true;
  }
  return false;
}
