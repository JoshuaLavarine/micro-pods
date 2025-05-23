import { Pod } from "@/app/types";
import {
  paginateAndSortPods,
  createPod,
  removePodById,
} from "../responseHelpers";

describe("responseHelpers", () => {
  describe("paginateAndSortPods", () => {
    it("should paginate and sort pods in ascending order", () => {
      const pods = [
        { id: 3, title: "Pod 3" },
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
      ];
      const page = 1;
      const pageSize = 2;
      const sortBy = "oldestFirst";

      const { pods: paginated, total } = paginateAndSortPods(
        pods,
        page,
        pageSize,
        sortBy
      );

      expect(total).toBe(3);
      expect(paginated).toEqual([
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
      ]);
    });

    it("should paginate and sort pods in descending order", () => {
      const pods = [
        { id: 3, title: "Pod 3" },
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
      ];
      const page = 1;
      const pageSize = 2;
      const sortBy = "newestFirst";

      const { pods: paginated, total } = paginateAndSortPods(
        pods,
        page,
        pageSize,
        sortBy
      );

      expect(total).toBe(3);
      expect(paginated).toEqual([
        { id: 3, title: "Pod 3" },
        { id: 2, title: "Pod 2" },
      ]);
    });

    it("should return an empty array if page exceeds total pages", () => {
      const pods = [
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
      ];
      const page = 3;
      const pageSize = 2;
      const sortBy = "oldestFirst";

      const { pods: paginated, total } = paginateAndSortPods(
        pods,
        page,
        pageSize,
        sortBy
      );

      expect(total).toBe(2);
      expect(paginated).toEqual([]);
    });

    it("should handle an empty pods array", () => {
      const pods: Pod[] = [];
      const page = 1;
      const pageSize = 2;
      const sortBy = "oldestFirst";

      const { pods: paginated, total } = paginateAndSortPods(
        pods,
        page,
        pageSize,
        sortBy
      );

      expect(total).toBe(0);
      expect(paginated).toEqual([]);
    });
  });

  describe("createPod", () => {
    let pods: Pod[];
    let podsIdCounter: { value: number };
    beforeEach(() => {
      pods = [
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
      ];
      podsIdCounter = { value: 3 };
    });

    afterEach(() => {
      // Reset the pods array
      pods = [
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
      ];
      podsIdCounter = { value: 3 };
    });

    it("should create a new pod and add it to the pods array", () => {
      const newPod = createPod(pods, podsIdCounter, "New Pod");
      expect(newPod).toEqual({ id: 3, title: "New Pod" });
      expect(pods).toContainEqual({ id: 3, title: "New Pod" });
    });

    it("should increment the id of the new pod correctly", () => {
      createPod(pods, podsIdCounter, "Pod 3");
      const newPod = createPod(pods, podsIdCounter, "Pod 4");
      expect(newPod.id).toBe(4);
    });
  });

  describe("removePodById", () => {
    let pods: Pod[];

    beforeEach(() => {
      pods = [
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
        { id: 3, title: "Pod 3" },
      ];
    });

    it("should remove a pod by its id and return true", () => {
      const result = removePodById(pods, 2);
      expect(result).toBe(true);
      expect(pods).toEqual([
        { id: 1, title: "Pod 1" },
        { id: 3, title: "Pod 3" },
      ]);
    });

    it("should return false if the pod with the given id does not exist", () => {
      const result = removePodById(pods, 4);
      expect(result).toBe(false);
      expect(pods).toEqual([
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
        { id: 3, title: "Pod 3" },
      ]);
    });

    it("should handle an empty pods array and return false", () => {
      pods = [];
      const result = removePodById(pods, 1);
      expect(result).toBe(false);
      expect(pods).toEqual([]);
    });

    it("should not modify the pods array if the id does not exist", () => {
      const result = removePodById(pods, 99);
      expect(result).toBe(false);
      expect(pods).toEqual([
        { id: 1, title: "Pod 1" },
        { id: 2, title: "Pod 2" },
        { id: 3, title: "Pod 3" },
      ]);
    });
  });
});
