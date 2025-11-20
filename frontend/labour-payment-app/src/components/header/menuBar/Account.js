import React from "react";
import { useNavigate } from "react-router-dom";

const userData = {
  username: "Demo User",
  userId: "USR123456",
  userType: "Labourer", // Or Labourer, Admin, etc.
  mobileNumber: "+91 9876543210",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backButton: {
    margin: "24px 0 16px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 24px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.13)",
  },
  container: {
    width: 360,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
    padding: 32,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    background: "#e3f2fd",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    color: "#1565c0",
    marginBottom: 16,
  },
  item: {
    width: "100%",
    fontSize: 17,
    margin: "8px 0",
  },
  field: {
    color: "#1565c0",
    fontWeight: 600,
    marginRight: 5,
  },
  btn: {
    background: "#e53935",
    color: "white",
    padding: "10px 0",
    marginTop: 32,
    border: "none",
    outline: "none",
    borderRadius: 6,
    width: "100%",
    fontWeight: 600,
    letterSpacing: 1,
    cursor: "pointer",
    fontSize: "16px",
  },
};

function AccountPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any user state/session here
    navigate("/"); // Go to login page
  };

  const handleBack = () => {
    navigate("/dashboard"); // Go to dashboard page
  };

  // Initial of username for avatar
  const avatarText =
    !userData.username || userData.username.length === 0
      ? "U"
      : userData.username
          .split(" ")
          .map((w) => (w[0] || "").toUpperCase())
          .join("");

  return (
    <div style={styles.page}>
      {/* "Back to Dashboard" button */}
      <button style={styles.backButton} onClick={handleBack}>
        <span>←</span>
        Back to Dashboard
      </button>
      <div style={styles.container}>
        <div style={styles.avatar}>{avatarText}</div>
        <div style={styles.item}>
          <span style={styles.field}>User name:</span> {userData.username}
        </div>
        <div style={styles.item}>
          <span style={styles.field}>User ID:</span> {userData.userId}
        </div>
        <div style={styles.item}>
          <span style={styles.field}>Type of user:</span> {userData.userType}
        </div>
        <div style={styles.item}>
          <span style={styles.field}>Mobile number:</span> {userData.mobileNumber}
        </div>
        <button style={styles.btn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
