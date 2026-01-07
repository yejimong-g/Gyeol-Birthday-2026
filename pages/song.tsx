export default function Song() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#000",
      }}
    >
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/AXfRmYr2sWE?start=32&end=212"
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
