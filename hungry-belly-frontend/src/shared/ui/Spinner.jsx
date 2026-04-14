export default function Spinner({
  message = "Loading...",
  overlay = false,
  minHeight = "16rem",
}) {
  return (
    <div
      className={
        overlay
          ? "position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          : "w-100 d-flex flex-column align-items-center justify-content-center"
      }
      style={
        overlay
          ? { backgroundColor: "rgba(255, 255, 255, 0.72)", zIndex: 2 }
          : { minHeight }
      }
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div
        className="spinner-border"
        style={{ color: "rgb(224, 57, 74)", width: "2.5rem", height: "2.5rem" }}
      >
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="mt-3 mb-0 text-secondary fw-semibold">{message}</p>
    </div>
  );
}