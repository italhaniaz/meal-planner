import { useState, useEffect } from "react";
import { db, auth } from "./firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DishForm from "./components/DishForm";
import DishList from "./components/DishList";
import TodaySuggestion from "./components/TodaySuggestion";
import Navbar from "./components/Navbar";
import RecipeDiscovery from "./components/RecipeDiscovery";
import Login from "./components/Login";
import { ChefHat, Soup, Salad, IceCreamBowl, Croissant, Apple, Pizza, Cherry, Cookie, Carrot, Fish } from "lucide-react";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setDishes([]);
      return;
    }
    const dishesQuery = query(collection(db, "dishes"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(dishesQuery, (snapshot) => {
      const dishData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDishes(dishData);
    });
    return () => unsubscribe();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="pointer-events-none fixed top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-400/20 dark:bg-emerald-500/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-[120px]" />

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Soup className="absolute top-24 left-[8%] w-16 h-16 text-emerald-900/[0.09] dark:text-emerald-300/[0.10] rotate-[-12deg] animate-float-slow" strokeWidth={1} />
        <Salad className="absolute top-[35%] right-[6%] w-20 h-20 text-emerald-900/[0.08] dark:text-emerald-300/[0.09] rotate-[10deg] animate-float-med" strokeWidth={1} />
        <Croissant className="absolute bottom-[24%] left-[5%] w-16 h-16 text-emerald-900/[0.09] dark:text-emerald-300/[0.10] rotate-[8deg] animate-float-slow" strokeWidth={1} />
        <Apple className="absolute bottom-[10%] right-[12%] w-14 h-14 text-emerald-900/[0.09] dark:text-emerald-300/[0.10] rotate-[-6deg] animate-float-fast" strokeWidth={1} />
        <Pizza className="absolute top-[8%] right-[22%] w-14 h-14 text-emerald-900/[0.08] dark:text-emerald-300/[0.09] rotate-[16deg] animate-float-med" strokeWidth={1} />
        <IceCreamBowl className="absolute bottom-[42%] left-[15%] w-12 h-12 text-emerald-900/[0.08] dark:text-emerald-300/[0.09] rotate-[-8deg] animate-float-slow" strokeWidth={1} />
        <Cherry className="absolute top-[55%] left-[2%] w-12 h-12 text-emerald-900/[0.08] dark:text-emerald-300/[0.09] rotate-[14deg] animate-float-fast" strokeWidth={1} />
        <Cookie className="absolute top-[65%] right-[4%] w-14 h-14 text-emerald-900/[0.08] dark:text-emerald-300/[0.09] rotate-[-10deg] animate-float-med" strokeWidth={1} />
        <Carrot className="absolute top-[2%] left-[38%] w-12 h-12 text-emerald-900/[0.08] dark:text-emerald-300/[0.09] rotate-[20deg] animate-float-slow" strokeWidth={1} />
        <Fish className="absolute bottom-[2%] left-[42%] w-14 h-14 text-emerald-900/[0.08] dark:text-emerald-300/[0.09] rotate-[-14deg] animate-float-fast" strokeWidth={1} />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative max-w-xl mx-auto px-5 py-10">
        {activeTab === "home" && (
          <>
            <div className="text-center mb-10 animate-fade-up">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <ChefHat className="w-7 h-7 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
                Meal Planner
              </h1>
              <p className="text-neutral-500 dark:text-neutral-500 mt-2 text-sm">
                Plan meals your whole family will love
              </p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
              <TodaySuggestion dishes={dishes} />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <DishForm userId={user.uid} />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <DishList dishes={dishes} />
            </div>
          </>
        )}

        {activeTab === "discover" && (
          <div className="pt-4">
            <RecipeDiscovery dishes={dishes} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;