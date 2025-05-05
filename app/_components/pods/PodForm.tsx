interface PodFormProps {
  input: string;
  setInput: (value: string) => void;
  addPod: () => void;
}

export default function PodForm({ input, setInput, addPod }: PodFormProps) {
  return (
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
          data-testid="pod-text-area"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Define your pod here..."
          rows={4}
          style={{
            width: "100%",
            resize: "vertical",
            overflowY: "auto",
            maxHeight: "150px",
            marginBottom: "5px",
            cursor: "text"
          }}
        />
        <div style={{ textAlign: "right", fontSize: "0.9em", color: "#777" }}>
          {input.length} characters
        </div>
        <button style={{ cursor: "pointer" }} onClick={addPod}>
          Add Pod
        </button>
      </div>
    </section>
  );
}
