// PodList.tsx
"use client";

import { useEffect, useState } from "react";

const defaultPageSize = 5;
const leftDoubleArrow = "\u00AB"; // «
const leftSingleArrow = "\u2039"; // <
const rightSingleArrow = "\u203A"; // >
const rightDoubleArrow = "\u00BB"; // »

export default function PodList() {
  const [pods, setPods] = useState([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [podsTotal, setPodsTotal] = useState(0);
  const [sortPreference, setSortPreference] = useState("desc");
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const fetchPods = async (
    targetPage = page,
    currentSort = sortPreference,
    size = pageSize
  ) => {
    const res = await fetch(
      `/api/pods?page=${targetPage}&pageSize=${size}&sortBy=${currentSort}`
    );
    const data = await res.json();
    setPods(data.pods);
    setPodsTotal(data.total);
  };

  useEffect(() => {
    fetchPods();
  }, [page, sortPreference, pageSize]);

  const addPod = async () => {
    const res = await fetch("/api/pods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    const res = await fetch("/api/pods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });

    if (res.status === 201) {
      setInput("");

      // Fetch total again to calculate new last page based on current pageSize
      const countRes = await fetch(
        `/api/pods?page=1&pageSize=1&sortBy=${sortPreference}`
      );
      const countData = await countRes.json();
      const updatedTotal = countData.total;
      const newTotalPages = Math.ceil(updatedTotal / pageSize);
      const targetPageAfterAdd = sortPreference === "asc" ? newTotalPages : 1;

      // Update the page state
      setPage(targetPageAfterAdd);

      // Immediately fetch the pods for the new page with the current pageSize
      fetchPods(targetPageAfterAdd, sortPreference, pageSize);
    }
  };

  const totalPages = Math.ceil(podsTotal / pageSize);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages && totalPages > 0;
  const firstResult = (page - 1) * pageSize + 1;
  const lastResult = Math.min(page * pageSize, podsTotal);

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1); // Reset to the first page when page size changes
  };

  const goToFirstPage = () => {
    setPage(1);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToLastPage = () => {
    setPage(totalPages);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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
              <option value="desc">ID Descending</option>
              <option value="asc">ID Ascending</option>
            </select>
          </span>
        </div>
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // Adjust minmax for desired size
            gap: "10px",
          }}
        >
          {pods.map((pod) => (
            <li
              key={pod.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                height: "150px", // Fixed height for all pods
                overflowY: "auto", // Enable scrolling for long text
                wordBreak: "break-word",
              }}
            >
              {pod.id}: {pod.title}
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
          <span>
            {firstResult}-{lastResult} of {podsTotal}
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
