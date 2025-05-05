"use client";

import { useEffect, useState } from "react";

const defaultPageSize = 5;
const leftDoubleArrow = "\u00AB";
const leftSingleArrow = "\u2039";
const rightSingleArrow = "\u203A";
const rightDoubleArrow = "\u00BB";

export default function PodsList() {
  const [pods, setPods] = useState([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [podsTotal, setPodsTotal] = useState(0);
  const [sortPreference, setSortPreference] = useState("newestFirst");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchPods = async (
    targetPage = page,
    currentSort = sortPreference,
    size = pageSize
  ) => {
    setIsFetching(true);
    setError(null); // Reset error state
    try {
      const res = await fetch(
        `/api/pods?page=${targetPage}&pageSize=${size}&sortBy=${currentSort}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch pods.");
      }
      const data = await res.json();
      setPods(data.pods);
      setPodsTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      fetchPods();
    }
  }, [page, sortPreference, pageSize, isHydrated]);

  const addPod = async () => {
    setError(null); // Reset error state
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

      const data = await res.json();
      const { pod: newPod, total: updatedTotal } = data;

      const newTotalPages = Math.ceil(updatedTotal / pageSize);
      const targetPageAfterAdd = sortPreference === "newestFirst" ? 1 : newTotalPages;

      setPods([...pods, newPod]);
      setPodsTotal(updatedTotal);
      setPage(targetPageAfterAdd);
      setInput("");

      fetchPods(targetPageAfterAdd, sortPreference, pageSize);
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePod = async (id) => {
    setIsFetching(true);
    setError(null); // Reset error state
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

      const data = await res.json();
      const { total: updatedTotal } = data;

      const newTotalPages = Math.ceil(updatedTotal / pageSize);
      const targetPageAfterDelete = Math.min(page, newTotalPages);

      setPods(pods.filter((pod) => pod.id !== id));
      setPodsTotal(updatedTotal);
      setPage(targetPageAfterDelete);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1);
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
      <header
        style={{
          padding: "20px",
          borderBottom: "1px solid #eee",
          textAlign: "center",
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 10,
        }}
      >
        <h1>Micro-Pods</h1>
      </header>

      <section
        style={{
          padding: "20px",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: "61px",
          backgroundColor: "white",
          zIndex: 9,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New pod"
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              overflowY: "auto",
              maxHeight: "150px",
              marginBottom: "5px",
            }}
          />
          <div style={{ textAlign: "right", fontSize: "0.9em", color: "#666" }}>
            {input.length} characters
          </div>
          <button onClick={addPod}>Add Pod</button>
        </div>
      </section>

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
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          {pods.map((pod) => (
            <li
              key={pod.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                height: "150px",
                overflowY: "auto",
                wordBreak: "break-word",
                position: "relative",
              }}
            >
              <button
                onClick={() => deletePod(pod.id)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "transparent",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                  lineHeight: "1",
                }}
                aria-label="Delete pod"
              >
                ×
              </button>
              <div style={{ paddingTop: "20px" }}>{pod.title}</div>
            </li>
          ))}
        </ul>
        {pods.length === 0 && <p>No pods created yet.</p>}
      </main>

      <footer
        style={{
          padding: "20px",
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          bottom: 0,
          position: "sticky",
          zIndex: 10,
        }}
      >
        <div>
          Result per page
          <select
            data-testid="page-size-select"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ marginLeft: "5px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div>
          <span data-testid="results-count">
            {podsTotal === 0
              ? "0 results"
              : `${firstResult}-${lastResult} of ${podsTotal}`}
          </span>
          <button
            onClick={goToFirstPage}
            disabled={isFirstPage}
            style={{
              marginLeft: "10px",
              fontWeight: "bold",
              cursor: isFirstPage ? "default" : "pointer",
            }}
            title="Go to first page"
          >
            {leftDoubleArrow}
          </button>
          <button
            onClick={goToPreviousPage}
            disabled={isFirstPage}
            style={{
              marginLeft: "5px",
              fontWeight: "bold",
              cursor: isFirstPage ? "default" : "pointer",
            }}
            title="Go to previous page"
          >
            {leftSingleArrow}
          </button>
          <button
            onClick={goToNextPage}
            disabled={isLastPage}
            style={{
              marginLeft: "5px",
              fontWeight: "bold",
              cursor: isLastPage ? "default" : "pointer",
            }}
            title="Go to next page"
          >
            {rightSingleArrow}
          </button>
          <button
            onClick={goToLastPage}
            disabled={isLastPage || totalPages === 0}
            style={{
              marginLeft: "5px",
              fontWeight: "bold",
              cursor: isLastPage || totalPages === 0 ? "default" : "pointer",
            }}
            title="Go to last page"
          >
            {rightDoubleArrow}
          </button>
        </div>
      </footer>
    </div>
  );
}
