import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { CheckCircle, XCircle } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupMessage, setSignupMessage] = useState("");

  // New state to track if a signup attempt has been made
  const [hasAttemptedSignup, setHasAttemptedSignup] = useState(false);

  // State to track password requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Only validate in real-time if a signup attempt has already been made
    if (hasAttemptedSignup) {
      validatePassword(newPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSignupMessage("");

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Signup mode
        // This is the first attempt, so we set the flag to true
        setHasAttemptedSignup(true);

        // Run validation on form submit
        const isPasswordValid = validatePassword(password);
        if (!isPasswordValid) {
          setError(
            "Please meet all password requirements to create an account."
          );
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (user) {
          await sendEmailVerification(user);
          setSignupMessage(
            "A verification email has been sent to your address. Please verify your email to log in."
          );
        }
      }
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

  // Reset the signup attempt status when switching modes
  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setHasAttemptedSignup(false);
    setError("");
    setSignupMessage("");
    setPassword("");
    setPasswordRequirements({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    });
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
          onChange={handlePasswordChange}
          placeholder="Password"
          required
        />
        {/* The list only appears if in signup mode AND an attempt has been made */}
        {mode === "signup" && hasAttemptedSignup && (
          <div className="w-full mt-2 mb-4">
            <ul className="text-sm">
              <li
                className={`flex items-center space-x-2 ${
                  passwordRequirements.minLength
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordRequirements.minLength ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>At least 8 characters long</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  passwordRequirements.hasUpperCase
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordRequirements.hasUpperCase ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>Include an uppercase letter</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  passwordRequirements.hasLowerCase
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordRequirements.hasLowerCase ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>Include a lowercase letter</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  passwordRequirements.hasNumber
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordRequirements.hasNumber ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>Include a number</span>
              </li>
              <li
                className={`flex items-center space-x-2 ${
                  passwordRequirements.hasSpecialChar
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordRequirements.hasSpecialChar ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>Include a special character (@$!%*?&)</span>
              </li>
            </ul>
          </div>
        )}

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
              onClick={() => switchMode("signup")}
            >
              Create Account
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <button
              className="text-orange-600 hover:underline font-semibold"
              onClick={() => switchMode("login")}
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
      {signupMessage && (
        <div className="w-full bg-green-50 border border-green-200 text-green-700 rounded-lg p-2 mt-2 text-center">
          {signupMessage}
        </div>
      )}
    </div>
  );
}
