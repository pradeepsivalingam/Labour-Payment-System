import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size/throttled";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #e7eff6 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 12px",
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
  },
  container: {
    maxWidth: 780,
    width: "100%",
    margin: "8px auto",
    display: "flex",
    flexDirection: "column",
    gap: 28,
    zIndex: 2,
    position: "relative",
  },
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(25,118,210,0.1)",
    padding: "28px 28px",
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 28px rgba(25,118,210,0.15)",
    },
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 22,
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#1565c0",
    paddingBottom: "8px",
    borderBottom: "2px dashed rgba(25,118,210,0.15)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px 16px",
  },
  label: {
    color: "#334155",
    fontSize: 16,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #c5d8f7",
    borderRadius: 8,
    flex: "1 1",
    fontSize: 15,
    minWidth: 220,
    backgroundColor: "#f8fafc",
    transition: "border 0.2s",
    ":focus": {
      borderColor: "#1976d2",
      outline: "none",
    },
  },
  btnPrimary: {
    background: "linear-gradient(95deg, #1976d2 0%, #2e8de8 98%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 28px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    transition: "all 0.2s, transform 0.05s",
    boxShadow: "0 1px 12px rgba(25,118,210,0.16)",
    ":hover": {
      background: "linear-gradient(95deg, #1a6dc4 0%, #2c85dd 98%)",
      transform: "translateY(-1px)",
    },
    ":active": {
      transform: "translateY(1px) scale(0.98)",
    },
  },
  btnDanger: {
    background: "linear-gradient(95deg, #e53935 0%, #f44336 98%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 28px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    transition: "all 0.2s, transform 0.05s",
    boxShadow: "0 1px 12px rgba(229,57,53,0.16)",
    ":hover": {
      transform: "translateY(-1px)",
      background: "linear-gradient(95deg, #d32f2f 0%, #e53935 98%)",
    },
    ":active": {
      transform: "translateY(1px) scale(0.98)",
    },
  },
  toggle: {
    position: "relative",
    display: "inline-block",
    width: 56,
    height: 28,
  },
  toggleSlider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#cbd5e1",
    transition: "0.4s",
    borderRadius: 34,
    scale: 0.9,
  },
  toggleSliderActive: {
    backgroundColor: "#1976d2",
  },
  toggleSliderKnob: {
    position: "absolute",
    height: 22,
    width: 22,
    left: 4,
    bottom: 3,
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "0.4s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  toggleSliderKnobActive: {
    transform: "translateX(26px)",
  },
  avatar: {
    width: 80,
    height: 80,
    background: `linear-gradient(135deg, ${"#1976d2"} 0%, ${"#1a78d4"} 100%)`,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 38,
    color: "#fff",
    boxShadow: "0 8px 16px rgba(25,118,210,0.16)",
    margin: "0 auto 16px",
  },
  avatarText: {
    fontWeight: 700,
  },
  avatarUploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "rgba(25,118,210,0.1)",
    color: "#1976d2",
    border: "2px dashed #1976d2",
    borderRadius: 8,
    padding: "8px 16px",
    margin: "8px auto 0",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
    ":hover": {
      background: "rgba(25,118,210,0.2)",
    },
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "right",
    paddingTop: 4,
    paddingRight: 8,
  },
  successMessage: {
    color: "#22c55e",
    fontSize: 14,
    textAlign: "right",
    paddingTop: 4,
    paddingRight: 8,
  },
  loadingSpinner: {
    display: "inline-block",
    border: "2px solid rgba(255,255,255,0.25)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    width: 16,
    height: 16,
    animation: "spin 0.8s linear infinite",
    marginRight: 8,
    verticalAlign: "middle",
  },
  dangerCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(229,57,53,0.1)",
    border: "2px solid #ffebee",
    padding: "28px 28px",
    transition: "transform 0.2s, box-shadow 0.2s",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 28px rgba(229,57,53,0.15)",
    },
  },
  dangerTitle: {
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 22,
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#dc2626",
    paddingBottom: "8px",
    borderBottom: "2px dashed rgba(229,57,53,0.15)",
  },
  badge: {
    background: "linear-gradient(95deg, #22c55e 0%, #4ade80 98%)",
    color: "#fff",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(34,197,94,0.2)",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    marginLeft: 6,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    background: "rgba(25,118,210,0.1)",
    color: "#1976d2",
    border: "2px solid #1976d2",
    borderRadius: 8,
    padding: "12px 24px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
    transition: "all 0.2s, transform 0.05s",
    boxShadow: "0 4px 12px rgba(25,118,210,0.12)",
    ":hover": {
      background: "rgba(25,118,210,0.2)",
      transform: "translateY(-1px)",
    },
    ":active": {
      transform: "translateY(1px) scale(0.98)",
    },
  },
};

function SettingsPage() {
  const navigate = useNavigate();
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  // User data
  const userData = {
    username: "Demo User",
    userId: "USR123456",
    userType: "Labourer",
    mobileNumber: "+91 9876543210",
  };

  // State hooks
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  });
  const [preferences, setPreferences] = useState({
    theme: "Light",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "123,456.00",
  });
  const [is2FA, setIs2FA] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Handlers
  const handleLogout = () => {
    toast.info("Logout successful. Redirecting...");
    setTimeout(() => navigate("/"), 1000);
  };
  const handleBack = () => navigate("/dashboard");
  const handleToggle = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  const handlePreferenceChange = (key, value) =>
    setPreferences((prev) => ({ ...prev, [key]: value }));

  const handleSavePassword = () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPasswordSuccess("Password updated successfully! 🎉");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  const handleClearCache = () => {
    toast.success("Cache cleared successfully!");
  };

  const handleDataExport = () => {
    toast.info("Export request sent. Check your email.");
  };

  // User initials for avatar
  const avatarText = useMemo(() => {
    if (!userData.username || userData.username.length === 0) return "U";
    return userData.username
      .split(" ")
      .map((w) => w[0].toUpperCase())
      .join("");
  }, [userData.username]);

  return (
    <>
      <div style={styles.page}>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <div style={styles.container}>
          {/* Profile Section */}
          <div
            style={{
              ...styles.card,
              background: "rgba(255,255,255,0.97)",
            }}
          >
            <h2 style={styles.cardTitle}>
              👤 Profile <span style={styles.badge}>Active</span>
            </h2>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>{avatarText}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>User Name:</span>
              <span>{userData.username}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>User ID:</span>
              <span>{userData.userId}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>User Type:</span>
              <span>{userData.userType}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Mobile:</span>
              <span>{userData.mobileNumber}</span>
            </div>
            <button style={styles.avatarUploadBtn}>
              <span>📷</span> Change Profile Photo
            </button>
          </div>

          {/* Security Section */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🔐 Security</h2>
            <div style={styles.row}>
              <span style={styles.label}>Two-factor Authentication</span>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={is2FA}
                  onChange={() => setIs2FA(!is2FA)}
                  style={styles.toggleInput}
                />
                <span
                  style={{
                    ...styles.toggleSlider,
                    ...(is2FA ? styles.toggleSliderActive : {}),
                  }}
                />
                <span
                  style={{
                    ...styles.toggleSliderKnob,
                    ...(is2FA ? styles.toggleSliderKnobActive : {}),
                  }}
                />
              </label>
            </div>
            <hr style={{ margin: "20px 0", borderColor: "#e2e8f0" }} />
            <div style={styles.row}>
              <span style={styles.label}>Old Password:</span>
              <input
                style={styles.input}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
              />
            </div>
            <div style={styles.row}>
              <span style={styles.label}>New Password:</span>
              <input
                style={styles.input}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Confirm:</span>
              <input
                style={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            {passwordError && (
              <div style={styles.errorMessage}>{passwordError}</div>
            )}
            {passwordSuccess && (
              <div style={styles.successMessage}>{passwordSuccess}</div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 12,
              }}
            >
              <button
                style={styles.btnPrimary}
                onClick={handleSavePassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span style={styles.loadingSpinner} />
                    Saving...
                  </>
                ) : (
                  "Save Password"
                )}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🔔 Notifications</h2>
            <div style={styles.row}>
              <span style={styles.label}>Email Notifications</span>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleToggle("email")}
                  style={styles.toggleInput}
                />
                <span
                  style={{
                    ...styles.toggleSlider,
                    ...(notifications.email ? styles.toggleSliderActive : {}),
                  }}
                />
                <span
                  style={{
                    ...styles.toggleSliderKnob,
                    ...(notifications.email ? styles.toggleSliderKnobActive : {}),
                  }}
                />
              </label>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>SMS Notifications</span>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={() => handleToggle("sms")}
                  style={styles.toggleInput}
                />
                <span
                  style={{
                    ...styles.toggleSlider,
                    ...(notifications.sms ? styles.toggleSliderActive : {}),
                  }}
                />
                <span
                  style={{
                    ...styles.toggleSliderKnob,
                    ...(notifications.sms ? styles.toggleSliderKnobActive : {}),
                  }}
                />
              </label>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Push Notifications</span>
              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleToggle("push")}
                  style={styles.toggleInput}
                />
                <span
                  style={{
                    ...styles.toggleSlider,
                    ...(notifications.push ? styles.toggleSliderActive : {}),
                  }}
                />
                <span
                  style={{
                    ...styles.toggleSliderKnob,
                    ...(notifications.push ? styles.toggleSliderKnobActive : {}),
                  }}
                />
              </label>
            </div>
          </div>

          {/* Preferences */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>⚙️ Preferences</h2>
            <div style={styles.row}>
              <span style={styles.label}>Theme</span>
              <select
                style={styles.input}
                value={preferences.theme}
                onChange={(e) => handlePreferenceChange("theme", e.target.value)}
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Language</span>
              <select
                style={styles.input}
                value={preferences.language}
                onChange={(e) =>
                  handlePreferenceChange("language", e.target.value)
                }
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Date Format</span>
              <select
                style={styles.input}
                value={preferences.dateFormat}
                onChange={(e) =>
                  handlePreferenceChange("dateFormat", e.target.value)
                }
              >
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Number Format</span>
              <select
                style={styles.input}
                value={preferences.numberFormat}
                onChange={(e) =>
                  handlePreferenceChange("numberFormat", e.target.value)
                }
              >
                <option>123,456.00</option>
                <option>123456.00</option>
                <option>1.23.456,00</option>
              </select>
            </div>
          </div>

          {/* Support & About */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>ℹ️ About & Support</h2>
            <div style={styles.row}>
              <span style={styles.label}>App Version:</span>
              <span>1.2.5</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Help & Contact:</span>
              <button style={{ ...styles.btnPrimary, minWidth: "auto" }}>
                Contact Support
              </button>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Privacy Policy:</span>
              <button style={{ ...styles.btnPrimary, minWidth: "auto" }}>
                View
              </button>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Data Export (CSV):</span>
              <button
                style={{ ...styles.btnPrimary, minWidth: "auto" }}
                onClick={handleDataExport}
              >
                Export My Data
              </button>
            </div>
          </div>

          {/* Danger Zone & Actions */}
          <div style={styles.dangerCard}>
            <h2 style={styles.dangerTitle}>☠️ Advanced</h2>
            <div style={styles.row}>
              <span style={styles.label}>Clear Cache</span>
              <button
                style={{ ...styles.btnPrimary, minWidth: "auto" }}
                onClick={handleClearCache}
              >
                Clear
              </button>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Logout</span>
              <button style={styles.btnDanger} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Back Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button style={styles.backButton} onClick={handleBack}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
    </>
  );
}

export default SettingsPage;
