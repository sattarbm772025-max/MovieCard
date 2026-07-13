import "./Footer.css";

function Footer() {

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h2>MovieCard</h2>

          <p>
            Discover movies, manage your favorites, build watchlists, and follow collections with a focused cinematic dashboard.
          </p>
        </div>

        <div className="footer-social">
          <span>Facebook</span>
          <span>Instagram</span>
          <span>Twitter</span>
          <span>YouTube</span>
        </div>

        <p className="copyright">
          © 2026 MovieCard. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
