import "./Loader.css";

function Loader() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="skeleton-card" key={index}>

          <div className="skeleton-image"></div>

          <div className="skeleton-content">

            <div className="skeleton-title"></div>

            <div className="skeleton-text"></div>

            <div className="skeleton-text short"></div>

            <div className="skeleton-buttons">

              <div className="skeleton-btn"></div>

              <div className="skeleton-btn"></div>

            </div>

          </div>

        </div>
      ))}
    </div>
  );
}

export default Loader;