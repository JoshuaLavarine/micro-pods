import { Pod } from "../../types";

interface PodListProps {
  pods: Pod[];
  deletePod: (id: number) => void;
}

export default function PodList({ pods, deletePod }: PodListProps) {
  return (
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
  );
}