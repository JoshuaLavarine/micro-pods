// Used in GET request
export function paginateAndSortPods(pods, page, pageSize, sortBy) {
  const total = pods.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const sortedPods = [...pods].sort((a, b) =>
    sortBy === "asc" ? a.id - b.id : b.id - a.id
  );
  const paginated = sortedPods.slice(start, end);
  return { paginated, total };
}

// Used in POST request
export function createPod(pods, title) {
  const newPod = { id: pods.length + 1, title };
  pods.push(newPod);
  return newPod;
}

// Used in DELETE request
export function removePodById(podsArray, id) {
  const index = podsArray.findIndex((pod) => pod.id === id);
  if (index !== -1) {
    podsArray.splice(index, 1);
    return true;
  }
  return false;
}
