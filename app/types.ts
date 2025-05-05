export interface Pod {
  id: number;
  title: string;
}

export interface PaginatedPods {
  paginated: Pod[];
  total: number;
}

export interface CreatePodRequest {
  title: string;
}

export interface DeletePodRequest {
  id: number;
}