import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user } = useAuth();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved : "dark";
    });

  // ✅ APPLY THEME BEFORE PAINT (FIX DARK FLASH ISSUE)
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";

    applyTheme(savedTheme);
    setTheme(savedTheme);
  }, []);

  // Load theme from logged-in user (sync with backend)
  useEffect(() => {
    if (user?.theme) {
        setTheme(user.theme);
        applyTheme(user.theme);
    } else {
        applyTheme(theme);
    }
    }, [user]);

  useEffect(() => {
    applyTheme(theme);
    }, []);

  function applyTheme(mode) {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  async function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    applyTheme(newTheme);

    localStorage.setItem("theme", newTheme); // ✅ ADD THIS

    try {
        await api.put("/auth/theme", { theme: newTheme });
    } catch (err) {
        console.log("Theme update failed", err);
    }
    }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);