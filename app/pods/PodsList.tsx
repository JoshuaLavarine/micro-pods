"use client";

import { useEffect, useState } from "react";

const defaultPageSize = 5;
const leftArrow = "<";
const rightArrow = ">";

export default function PodList() {
  const [pods, setPods] = useState([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [podsTotal, setPodsTotal] = useState(0);
  const [pageInput, setPageInput] = useState(page);
  const [pageJumpError, setPageJumpError] = useState(false);
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
      setInput(""); // Fetch total again to calculate new last page based on current pageSize

      const countRes = await fetch(
        `/api/pods?page=1&pageSize=1&sortBy=${sortPreference}`
      );
      const countData = await countRes.json();
      const updatedTotal = countData.total;
      const newTotalPages = Math.ceil(updatedTotal / pageSize);
      const targetPageAfterAdd = sortPreference === "asc" ? newTotalPages : 1; // Update the page state

      setPage(targetPageAfterAdd); // Immediately fetch the pods for the new page with the current pageSize

      fetchPods(targetPageAfterAdd, sortPreference, pageSize);
    }
  };

  const totalPages = Math.ceil(podsTotal / pageSize);
  const visiblePages = [page - 2, page - 1, page, page + 1, page + 2].filter(
    (pageNum) => pageNum > 0 && pageNum <= totalPages
  );

  const handlePageJump = () => {
    const target = parseInt(pageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      setPage(target);
      setPageInput("");
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1); // Reset to the first page when page size changes
  };

  return (
    <div>
            <h1>Pods</h1>     
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
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
      <br />
      <button onClick={addPod}>Add Pod</button>
      <select
        value={sortPreference}
        onChange={(e) => setSortPreference(e.target.value)}
      >
                <option value="desc">Sort by ID Descending</option>       {" "}
        <option value="asc">Sort by ID Ascending</option>     {" "}
      </select>
           {" "}
      <select value={pageSize} onChange={handlePageSizeChange}>
                <option value={5}>5 per page</option>       {" "}
        <option value={10}>10 per page</option>       {" "}
        <option value={25}>25 per page</option>       {" "}
        <option value={50}>50 per page</option>       {" "}
        <option value={100}>100 per page</option>     {" "}
      </select>
           {" "}
      <ul>
               {" "}
        {pods.map((pod) => (
          <li key={pod.id}>
                        {pod.id}: {pod.title}         {" "}
          </li>
        ))}
             {" "}
      </ul>
           {" "}
      <div style={{ marginTop: "20px" }}>
               {" "}
        <button
          style={{ marginRight: "20px", fontWeight: "bold" }}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
                    {leftArrow}       {" "}
        </button>
                {page}       {" "}
        <button
          style={{ marginLeft: "20px", fontWeight: "bold" }}
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
                    {rightArrow}       {" "}
        </button>
                Page {page} of {totalPages === 0 ? 1 : totalPages}     {" "}
      </div>
           {" "}
      <div style={{ marginTop: "10px" }}>
               {" "}
        <input
          type="number"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onFocus={() => setPageJumpError(false)}
          placeholder="Go to page"
          max={totalPages}
          min={1}
          style={{ width: "100px" }}
        />
               {" "}
        <button
          onClick={() => {
            const target = parseInt(pageInput, 10);
            if (target > totalPages || target < 1 || isNaN(target)) {
              setPageJumpError(true);
            } else {
              handlePageJump();
            }
          }}
        >
                    Go        {" "}
        </button>
               {" "}
        <p style={{ color: "red" }}>
                    {pageJumpError && "Page must be between 1 & " + totalPages} 
               {" "}
        </p>
             {" "}
      </div>
         {" "}
    </div>
  );
}
