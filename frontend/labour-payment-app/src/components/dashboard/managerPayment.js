import React, { useState } from "react";

function ManagerPayments() {
  // Note: Now all fields are controlled with their initial values (matching your business logic)
  const [masonShift, setMasonShift] = useState("0");
  const [masonRate, setMasonRate] = useState("0");
  const [helperShift, setHelperShift] = useState("0");
  const [helperRate, setHelperRate] = useState("0");
  const [advance, setAdvance] = useState("0");

  const [isEditing, setIsEditing] = useState(false);

  // Safe float parse: returns 0 for invalid/empty input
  const toFloat = (v) => parseFloat(v) || 0;

  // Calculations (always in two decimal places)
  const masonTotal = toFloat(masonShift) * toFloat(masonRate);
  const helperTotal = toFloat(helperShift) * toFloat(helperRate);
  const totalAmount = masonTotal + helperTotal;
  const grantTotal = totalAmount - toFloat(advance);

  // Format currency (with commas, 2 decimals)
  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);

  // Auto-reset to empty string if not a valid decimal
  const handleNumberChange = (setter, value) => {
    if (value === "" || !isNaN(value) || value.endsWith(".")) {
      setter(value);
    }
  };

  const handleEditSave = () => {
    setIsEditing(!isEditing);
    // Optionally, save data here (if you want server sync)
  };

  // Style constants for the card
  const css = {
    card: {
      maxWidth: 840,
      textAlign: "center",
      margin: "30px auto",
      border: "1px solid #eaeaea",
      borderRadius: 22,
      boxShadow: "0 6px 30px rgba(0,0,0,0.1)",
      padding: 40,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif",
      background: "#fff",
    },
    heading: {
      textAlign: "center",
      marginBottom: 36,
      color: "#1976d2",
      fontWeight: 700,
      fontSize: 24,
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      marginBottom: 24,
      gap: 12,
      justifyContent: "space-between"
    },
    labelGroup: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
      flex: "1 1 auto"
    },
    label: {
      fontWeight: 500,
      color: "#333",
      minWidth: 100,
      textAlign: "left"
    },
    input: {
      border: "1px solid #e0e0e0",
      borderRadius: 8,
      padding: "12px 14px",
      fontSize: 16,
      width: 120,
      textAlign: "right",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      backgroundColor: isEditing ? "#f8f9ff" : "#fafafa",
      color: "#333",
      cursor: isEditing ? "text" : "not-allowed"
    },
    readonly: {
      pointerEvents: "none",
    },
    result: {
      fontWeight: 600,
      color: "#1976d2",
      minWidth: 120,
      textAlign: "right"
    },
    separator: {
      height: 1,
      background: "#eee",
      margin: "32px 0",
    },
    grantTotal: {
      textAlign: "center",
      fontSize: 26,
      fontWeight: 700,
      margin: "36px 0 16px",
      background: "linear-gradient(90deg, #0d6e0d, #28a745)",
      color: "#fff",
      padding: "16px 36px",
      borderRadius: 12,
      display: "inline-block"
    },
    editButton: {
      background: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "12px 36px",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      margin: "24px 0 0 0",
      transition: "background 0.2s, transform 0.1s",
      ":active": { transform: "translateY(2px)" }
    },
    hoverFocus: {
      borderColor: "#1976d2",
      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)"
    },
  };

  return (
    <div style={css.card}>
      <h2 style={css.heading}>Manager Payments</h2>

      {/* Mason */}
      <div style={css.row}>
        <span style={css.label}>Mason</span>
        <div style={css.labelGroup}>
          <span style={css.label}>Total Shift:</span>
          <input
            type="text"
            step="0.01"
            value={masonShift}
            onChange={(e) => handleNumberChange(setMasonShift, e.target.value)}
            style={{ ...css.input, ...(!isEditing ? css.readonly : {}) }}
            disabled={!isEditing}
            aria-labelledby="mason-shift-label"
            tabIndex={isEditing ? 0 : -1}
          />
          <span style={css.label}>Amount/Shift:</span>
          <input
            type="text"
            step="0.01"
            value={masonRate}
            onChange={(e) => handleNumberChange(setMasonRate, e.target.value)}
            style={{ ...css.input, ...(!isEditing ? css.readonly : {}) }}
            disabled={!isEditing}
            aria-labelledby="mason-rate-label"
            tabIndex={isEditing ? 0 : -1}
          />
          <span style={{ ...css.label, minWidth: 40 }}>=</span>
          <span style={css.result}>₹ {formatCurrency(masonTotal)}</span>
        </div>
      </div>

      {/* Helper */}
      <div style={css.row}>
        <span style={css.label}>Helper</span>
        <div style={css.labelGroup}>
          <span style={css.label}>Total Shift:</span>
          <input
            type="text"
            step="0.01"
            value={helperShift}
            onChange={(e) => handleNumberChange(setHelperShift, e.target.value)}
            style={{ ...css.input, ...(!isEditing ? css.readonly : {}) }}
            disabled={!isEditing}
            aria-labelledby="helper-shift-label"
            tabIndex={isEditing ? 0 : -1}
          />
          <span style={css.label}>Amount/Shift:</span>
          <input
            type="text"
            step="0.01"
            value={helperRate}
            onChange={(e) => handleNumberChange(setHelperRate, e.target.value)}
            style={{ ...css.input, ...(!isEditing ? css.readonly : {}) }}
            disabled={!isEditing}
            aria-labelledby="helper-rate-label"
            tabIndex={isEditing ? 0 : -1}
          />
          <span style={{ ...css.label, minWidth: 40 }}>=</span>
          <span style={css.result}>₹ {formatCurrency(helperTotal)}</span>
        </div>
      </div>

      <hr style={css.separator} />

      {/* Totals */}
      <div style={css.row}>
        <span style={css.label}>Total Amount:</span>
        <span style={css.result}>₹ {formatCurrency(totalAmount)}</span>
      </div>
      <div style={css.row}>
        <span style={css.label}>Advance:</span>
        <input
          type="text"
          step="0.01"
          value={advance}
          onChange={(e) => handleNumberChange(setAdvance, e.target.value)}
          style={{ ...css.input, width: 140, ...(!isEditing ? css.readonly : {}) }}
          disabled={!isEditing}
          aria-labelledby="advance-label"
          tabIndex={isEditing ? 0 : -1}
        />
      </div>

      <hr style={css.separator} />

      {/* Grant Total */}
      <div style={css.grantTotal}>
        <span>Grant Total: ₹ {formatCurrency(grantTotal)}</span>
      </div>

      <button
        onClick={handleEditSave}
        style={{
          background: isEditing ? "#28a745" : "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "14px 36px",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          margin: "32px auto 0 auto",
          display: "block",
          transition: "background 0.2s, transform 0.1s",
        }}
      >
        {isEditing ? "Save" : "Edit"}
      </button>
    </div>
  );
}

export default ManagerPayments;
