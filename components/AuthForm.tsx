import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <input
          className="w-full px-4 py-2 mb-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="w-full px-4 py-2 mb-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all mb-2"
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <button
        onClick={loginGoogle}
        className="w-full flex items-center justify-center border border-gray-300 text-gray-700 bg-white font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all mb-4"
      >
        <FcGoogle className="mr-2" size={20} />
        Sign in with Google
      </button>
      <div className="mb-2 text-sm">
        {mode === "login" ? (
          <span>
            Don't have an account?{" "}
            <button
              className="text-orange-600 hover:underline font-semibold"
              onClick={() => setMode("signup")}
            >
              Create Account
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button
              className="text-orange-600 hover:underline font-semibold"
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
          </span>
        )}
      </div>
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-lg p-2 mt-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
