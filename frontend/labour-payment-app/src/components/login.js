import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [userType, setUserType] = useState("Labor");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      setLoading(false);
      return;
    }

    const payload = {
      userType,
      username,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Login failed");
      }

      // Parse JSON
      const data = await response.json();

      // Now you can access id, username, etc.
      console.log("User ID:", data.id);

       // ✅ Save userId in localStorage
      localStorage.setItem("userId", data.id);

      // Redirect with userId from backend response
      navigate("/dashboard");


    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Login to Labour Payment System
        </h2>

        <form onSubmit={handleLogin}>
          {/* User Type Dropdown */}
          <div style={{ marginBottom: "16px" }}>
            <label>User Type:</label>
            <select
              style={inputStyle}
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="Labor">LABOR</option>
              <option value="Supervisor">SUPERVISOR</option>
              <option value="Engineer">ENGINEER</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="User ID"
            style={inputStyle}
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ textAlign: "right", marginBottom: "12px" }}>
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/forgotPassword")}
            >
              Forgot Password?
            </span>
          </div>

          {error && (
            <p style={{ color: "red", fontWeight: "bold", marginBottom: 8 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={submitBtnStyle}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ color: "#1976d2", cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f0f4f8",
};

const cardStyle = {
  width: "100%",
  maxWidth: "450px",
  background: "#fff",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
};

const submitBtnStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  marginTop: "12px",
  cursor: "pointer",
};

export default LoginPage;
