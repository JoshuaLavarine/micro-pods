interface FooterProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  setPage: (page: number) => void;
  podsTotal: number;
  firstResult: number;
  lastResult: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
}

export default function Footer({
  pageSize,
  setPageSize,
  setPage,
  podsTotal,
  firstResult,
  lastResult,
  isFirstPage,
  isLastPage,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}: FooterProps) {
  return (
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
          onChange={(e) => {setPageSize(parseInt(e.target.value, 10)); setPage(1)}}
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
          {"\u00AB"}
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
          {"\u2039"}
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
          {"\u203A"}
        </button>
        <button
          onClick={goToLastPage}
          disabled={isLastPage || podsTotal === 0}
          style={{
            marginLeft: "5px",
            fontWeight: "bold",
            cursor: isLastPage || podsTotal === 0 ? "default" : "pointer",
          }}
          title="Go to last page"
        >
          {"\u00BB"}
        </button>
      </div>
    </footer>
  );
}
