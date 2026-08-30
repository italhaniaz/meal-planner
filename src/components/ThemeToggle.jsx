import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved ? saved === "dark" : true;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400" strokeWidth={2} />
      ) : (
        <Moon className="w-5 h-5 text-indigo-500" strokeWidth={2} />
      )}
    </button>
  );
}

export default ThemeToggle;