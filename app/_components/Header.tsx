export default function Header() {
  return (
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
  );
}