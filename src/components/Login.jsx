import { useState } from "react";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ChefHat, Mail, Lock } from "lucide-react";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-5 transition-colors duration-300">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <ChefHat className="w-7 h-7 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
            Kids Meal Planner
          </h1>
          <p className="text-neutral-500 mt-2 text-sm">
            {isSignup ? "Create an account to get started" : "Log in to your account"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-7 shadow-xl shadow-neutral-200/50 dark:shadow-black/30"
        >
          <div className="mb-4">
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-500/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white dark:text-neutral-950 font-bold py-3 rounded-xl transition-colors duration-300 active:scale-[0.98]"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
          </button>

          <p className="text-center text-sm text-neutral-500 mt-5">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;