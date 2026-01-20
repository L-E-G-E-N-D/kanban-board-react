import { useState } from "react";

export default function Signup({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleSignup() {
    setError(null);

    fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Signup failed");
        return res.json();
      })
      .then(() => {
        setEmail("");
        setPassword("");
        setSuccess(true);
        setTimeout(()=>{
            onSwitch();
        },500)
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-80">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm mb-2">
            Account created. Please login.
          </p>
        )}

        <input
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 rounded mb-3"
        >
          Sign Up
        </button>

        <button
          onClick={onSwitch}
          className="text-sm text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
