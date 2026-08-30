import { ChefHat, LogOut, Sun, Moon, Compass, Home } from "lucide-react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";

function Navbar({ activeTab, setActiveTab }) {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved ? saved === "dark" : true;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "discover", label: "Discover", icon: Compass },
  ];

  return (
    <div
      className={`sticky top-0 z-30 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-neutral-950/85 border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
          : "bg-white/40 dark:bg-neutral-950/40 border-b border-transparent"
      }`}
    >
      <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/20">
            <ChefHat className="w-4.5 h-4.5 text-white" strokeWidth={2.25} />
          </span>
          <span className="font-extrabold text-neutral-900 dark:text-white hidden sm:block tracking-tight">
            Meal Planner
          </span>
        </div>

        <div className="relative flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-900/80 rounded-full p-1 border border-neutral-200/50 dark:border-neutral-800/50">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                activeTab === id
                  ? "text-white dark:text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {activeTab === id && (
                <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/25 animate-fade-up" style={{ animationDuration: "0.25s" }} />
              )}
              <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" strokeWidth={2} />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" strokeWidth={2} />
            )}
          </button>
          <button
            onClick={() => signOut(auth)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-red-500/10 text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-colors duration-300"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;