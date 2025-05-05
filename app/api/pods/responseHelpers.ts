// Used in GET request
export function paginateAndSortPods(pods, page, pageSize, sortBy) {
  const total = pods.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const sortedPods = [...pods].sort((a, b) =>
    sortBy === "oldestFirst" ? a.id - b.id : b.id - a.id
  );
  const paginated = sortedPods.slice(start, end);
  return { paginated, total };
}

// Used in POST request
export function createPod(pods, counter, title) {
  const newPod = { id: counter.value, title };
  pods.push(newPod);
  counter.value++;
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
