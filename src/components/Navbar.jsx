import { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";

const toggleMode = () => {
  return localStorage.getItem("darkMode") || "light";
};

// reducer funksiyasi
const themeReducer = (theme, action) => {
  switch (action.type) {
    case "TOGLE_MODE":
      return theme === "dark-mode" ? "light" : "dark-mode";
    default:
      return theme;
  }
};

function Navbar() {
  const { title } = useParams();
  const [theme, setTheme] = useReducer(themeReducer, toggleMode());

  const handleThemeToggle = (e) => {
    e.preventDefault();
    setTheme({ type: "TOGLE_MODE" });
  };

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(theme);
    localStorage.setItem("darkMode", theme);
  }, [theme]);

  return (
    <header className="header">
      <div className="header-container container">
        {title ? (
          <Link className="header-logo" to="/">
            <figure>
              <img
                src={`../assets/icon-${title.toLowerCase()}.svg`}
                alt="icon"
              />
            </figure>
            <span>{title}</span>
          </Link>
        ) : (
          <span></span>
        )}

        {/* NAVBAR TOGGLE */}
        <div>
          <label
            htmlFor="dark"
            className="dark-btn"
            onClick={handleThemeToggle}
          >
            <input
              type="checkbox"
              id="dark"
              checked={theme === "dark-mode"}
              readOnly
            />
            <span>
              <span></span>
              <span></span>
            </span>
          </label>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
