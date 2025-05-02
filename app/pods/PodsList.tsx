"use client";

import { useEffect, useState } from "react";

export default function PodList() {
  const [pods, setPods] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("/api/pods")
      .then((res) => res.json())
      .then(setPods);
  }, []);

  const addPod = async () => {
    const res = await fetch("/api/pods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    const newPod = await res.json();
    setPods([...pods, newPod]);
    setInput("");
  };

  pods.sort((a, b) => b.id - a.id);

  return (
    <div>
      <h1>Pods</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="New pod"
      />
      <button onClick={addPod}>Add Pod</button>
      <ul>
        {pods.map((pod) => (
          <li key={pod.id}>
            {pod.id}: {pod.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
