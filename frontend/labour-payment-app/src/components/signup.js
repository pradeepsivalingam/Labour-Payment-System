import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [userType, setUserType] = useState("Labor");
  const [contact, setContact] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Basic client validation:
    if (!contact || !username || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    const userData = {
      userType,
      contact,
      username,
      password,
    };

    try {
      const resp = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status}`);
      }

      // Optionally you can read response JSON:
      // const result = await resp.json();

      alert("Account created successfully!");
      navigate("/"); // redirect to login or home page
    } catch (e) {
      setError("Failed to create account. " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          Create an Account
        </h2>

        {/* User Type */}
        <div style={{ marginBottom: "16px" }}>
          <label>User Type:</label>
          <select
            style={inputStyle}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="Labor">Labor</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Engineer">Engineer</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Mobile or Email"
          style={inputStyle}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          type="text"
          placeholder="Create User ID"
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Create Password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "red", marginTop: 8, fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <div style={{ textAlign: "center", margin: "12px 0" }}>or</div>
        <button style={googleBtnStyle} disabled>
          Continue with Google
        </button>

        <button
          style={{ ...submitBtnStyle, opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto"}}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{ color: "#1976d2", cursor: "pointer" }}
          >
            Login
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
  boxSizing: "border-box",
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

const googleBtnStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#fff",
  color: "#444",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "not-allowed",
};

export default SignupPage;
