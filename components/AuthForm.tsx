// components/AuthForm.tsx
import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

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

  const loginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">{mode === "login" ? "Login" : "Signin"}</button>
      </form>
      <button onClick={loginGoogle}>Login with Google</button>
      <div>
        {mode === "login" ? (
          <span>
            New User?{" "}
            <button onClick={() => setMode("signup")}>Create Account</button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button onClick={() => setMode("login")}>Login</button>
          </span>
        )}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
