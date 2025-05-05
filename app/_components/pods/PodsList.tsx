"use client";

import { useCallback, useEffect, useState } from "react";
import { Pod, PaginatedPods } from "../../types";
import Header from "../Header";
import PodForm from "./PodForm";
import PodList from "./PodList";
import Footer from "../Footer";

const defaultPageSize = 5;

export default function PodsList() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [input, setInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [podsTotal, setPodsTotal] = useState<number>(0);
  const [sortPreference, setSortPreference] = useState<string>("newestFirst");
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(podsTotal / pageSize);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages && totalPages > 0;
  const firstResult = (page - 1) * pageSize + 1;
  const lastResult = Math.min(page * pageSize, podsTotal);

  useEffect(() => {
    const savedInput = localStorage.getItem("podInput");
    const savedPage = localStorage.getItem("currentPage");
    const savedSort = localStorage.getItem("sortPreference");
    const savedPageSize = localStorage.getItem("pageSize");

    if (savedInput !== null) setInput(savedInput);
    if (savedPage !== null) setPage(parseInt(savedPage, 10));
    if (savedSort !== null) setSortPreference(savedSort);
    if (savedPageSize !== null) setPageSize(parseInt(savedPageSize, 10));

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("podInput", input);
    localStorage.setItem("currentPage", page.toString());
    localStorage.setItem("sortPreference", sortPreference);
    localStorage.setItem("pageSize", pageSize.toString());
  }, [input, page, sortPreference, pageSize, isHydrated]);

  const fetchPods = useCallback(
    async (
      targetPage = page,
      currentSort = sortPreference,
      size = pageSize
    ) => {
      setIsFetching(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/pods?page=${targetPage}&pageSize=${size}&sortBy=${currentSort}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch pods.");
        }
        const data: PaginatedPods = await res.json();
        setPods(data.pods);
        setPodsTotal(data.total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    },
    [page, sortPreference, pageSize]
  );

  useEffect(() => {
    if (isHydrated) {
      fetchPods();
    }
  }, [fetchPods, page, sortPreference, pageSize, isHydrated]);

  const addPod = async () => {
    setError(null);
    try {
      const res = await fetch("/api/pods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create pod.");
      }

      const data: { pod: Pod; total: number } = await res.json();
      const newTotalPages = Math.ceil(data.total / pageSize);
      const targetPageAfterAdd =
        sortPreference === "newestFirst" ? 1 : newTotalPages;

      setPods([...pods, data.pod]);
      setPodsTotal(data.total);
      setPage(targetPageAfterAdd);
      setInput("");

      fetchPods(targetPageAfterAdd, sortPreference, pageSize);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deletePod = async (id: number) => {
    setIsFetching(true);
    setError(null);
    try {
      const res = await fetch("/api/pods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete pod.");
      }

      const data: { total: number } = await res.json();
      const newTotalPages = Math.ceil(data.total / pageSize);
      const targetPageAfterDelete = Math.min(page, newTotalPages);

      setPods(pods.filter((pod) => pod.id !== id));
      setPodsTotal(data.total);
      setPage(targetPageAfterDelete);

      fetchPods(targetPageAfterDelete, sortPreference, pageSize);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const goToFirstPage = () => setPage(1);
  const goToPreviousPage = () => page > 1 && setPage(page - 1);
  const goToNextPage = () => page < totalPages && setPage(page + 1);
  const goToLastPage = () => setPage(totalPages);

  if (!isHydrated || isFetching) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div className="spinner" />
        <p>{!isHydrated ? "Loading settings..." : "Loading pods..."}</p>
        <style jsx>{`
          .spinner {
            margin: 0 auto 10px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #555;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {error && (
        <div
          data-testid="error-banner"
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <Header />
      <PodForm input={input} setInput={setInput} addPod={addPod} />
      <main style={{ padding: "20px", flexGrow: 1, overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <h2>Your Pods</h2>
          <span>
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortPreference}
              onChange={(e) => setSortPreference(e.target.value)}
            >
              <option value="newestFirst">Newest First</option>
              <option value="oldestFirst">Oldest First</option>
            </select>
          </span>
        </div>
        <PodList pods={pods} deletePod={deletePod} />
        {pods.length === 0 && (
          <p data-testid="empty-pods">No pods created yet.</p>
        )}
      </main>
      <Footer
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPage={setPage}
        podsTotal={podsTotal}
        firstResult={firstResult}
        lastResult={lastResult}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        goToFirstPage={goToFirstPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        goToLastPage={goToLastPage}
      />
    </div>
  );
}
