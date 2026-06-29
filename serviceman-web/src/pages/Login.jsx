import { useState } from "react";

import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Enter email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await login({ email, password });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={submit}>
        <BrandLogo className="login-brand" />
        <h1 className="page-title">Serviceman Login</h1>
        <p className="muted">
          Sign in with your serviceman account to manage bookings and status updates.
        </p>

        <input
          className="input"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          type="email"
          value={email}
        />
        <input
          className="input"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
          value={password}
        />

        <button className="btn orange login-button" disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>

        {errorMessage ? <p className="error inline-error">{errorMessage}</p> : null}
      </form>
    </div>
  );
}
