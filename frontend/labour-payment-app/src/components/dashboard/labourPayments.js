import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Constants for theming and options
const colorPrimary = "#1976d2";
const colorSuccess = "#4CAF50";
const colorEditRow = "#f8f9fa";
const colorTextLight = "#f8f9fa";
const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
const borderRadius = "8px";
const boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
const LABOR_ROLES = ["Mason", "Helper"];

// Toast Notification
const Toast = ({ message, onClose }) => (
  <div style={{
    position: "fixed",
    top: 20,
    right: 20,
    background: colorSuccess,
    color: colorTextLight,
    padding: "12px 24px",
    borderRadius: borderRadius,
    boxShadow,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
  }}>
    {message}
    <button
      onClick={onClose}
      style={{
        background: "none",
        border: "none",
        color: "white",
        cursor: "pointer",
        marginLeft: "14px",
        fontWeight: "bold",
      }}
    >
    </button>
  </div>
);

// Helper function
const calculateRowTotals = (row) => {
  const total =
    row.noShifts * row.ratePerShift - row.foodAmount - row.advanceAmount + row.lastWeekBalance - row.lastWeekReturn;
  const diff = total - row.given;
  return {
    ...row,
    totalCalculated: total,
    currentWeekBalance: diff >= 0 ? diff : 0,
    currentWeekReturn: diff < 0 ? -diff : 0,
  };
};

// Restore from localStorage
const getInitialState = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("labourPayments");
    if (saved) {
      return JSON.parse(saved).map(calculateRowTotals);
    }
  }
  // Default data with role
  return [
    {
      name: "Raj",
      noShifts: 10.5,
      ratePerShift: 1000,
      foodAmount: -600,
      advanceAmount: -2500,
      lastWeekBalance: 106,
      lastWeekReturn: 0,
      given: 7500,
      typeOfPayment: "Cash",
      status: "Paid",
      role: "Mason",
      year: 2024,
      weekNumber: 32,
    },
    {
      name: "Kumar",
      noShifts: 7.5,
      ratePerShift: 1000,
      foodAmount: -400,
      advanceAmount: -1200,
      lastWeekBalance: 0,
      lastWeekReturn: -56,
      given: 6000,
      typeOfPayment: "Payment",
      status: "Paid",
      role: "Helper",
      year: 2024,
      weekNumber: 32,
    },
  ].map(calculateRowTotals);
};

const LabourPayment = () => {
  const [rows, setRows] = useState(getInitialState());
  const [editMode, setEditMode] = useState(new Array(getInitialState().length).fill(false));
  const [toastMessage, setToastMessage] = useState("");
  const [allWeeks, setAllWeeks] = useState([]);
  const [years, setYears] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedRole, setSelectedRole] = useState(LABOR_ROLES[0]);
  const navigate = useNavigate();

  // Fetch weeks from backend (simulate if not available)
  useEffect(() => {
    // Replace with your backend API if available
    fetch("http://localhost:8080/api/weeks")
      .then((res) => res.json())
      .then((data) => {
        setAllWeeks(data);
        const distinctYears = [...new Set(data.map(week => week.year))].sort((a, b) => b - a);
        setYears(distinctYears);
        const currentYear = new Date().getFullYear();
        let defaultYear = distinctYears.includes(currentYear) ? currentYear : distinctYears[0];
        if (defaultYear === undefined) defaultYear = null;
        setSelectedYear(defaultYear);
      })
      .catch(() => {
        // fallback if API fails
        setAllWeeks([]);
        setYears([2024]);
        setSelectedYear(2024);
      });
  }, []);

  useEffect(() => {
    if (selectedYear === null) {
      setWeeks([]);
      setSelectedWeek(null);
    } else {
      const yearWeeks = allWeeks.filter(w => w.year === selectedYear);
      setWeeks(yearWeeks);
      const today = new Date();
      const currentWeek = yearWeeks.find(week =>
        new Date(week.startDate) <= today && new Date(week.endDate) >= today
      );
      setSelectedWeek(currentWeek || (yearWeeks.length > 0 ? yearWeeks[0] : null));
    }
  }, [selectedYear, allWeeks]);

  // Save to localStorage on rows change
  useEffect(() => {
    localStorage.setItem("labourPayments", JSON.stringify(rows));
  }, [rows]);

  // Dropdown handlers
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value ? parseInt(e.target.value) : null);
  };

  const handleWeekChange = (e) => {
    const weekId = parseInt(e.target.value);
    setSelectedWeek(weeks.find(w => w.id === weekId));
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Table row handlers
  const handleInputChange = (index, field, value) => {
    setRows((prevRows) => {
      const updated = [...prevRows];
      const parsedValue = isNaN(value) ? value : parseFloat(value) || 0;
      updated[index] = { ...updated[index], [field]: parsedValue };
      return updated.map(calculateRowTotals);
    });
  };

  const toggleEdit = (index) => {
    const isEditMode = !editMode[index];
    setEditMode(prev => prev.map((mode, i) => i === index ? isEditMode : mode));
    setToastMessage(isEditMode ? "Edit Mode: Row " + (index + 1) : "Saved!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Filtered rows by role, year, week
  const filteredRows = rows.filter(
    (row) =>
      (!selectedRole || row.role === selectedRole) &&
      (!selectedYear || row.year === selectedYear) &&
      (!selectedWeek || row.weekNumber === selectedWeek.weekNumber)
  );

  // Payment types and status options
  const paymentTypes = ["Cash", "UPI", "Payment"];
  const statusOptions = ["Paid", "Unpaid"];

  // Styles
  const headerStyle = {
    backgroundColor: colorPrimary,
    color: colorTextLight,
  };
  const inputStyle = {
    width: "80px",
    textAlign: "right",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    padding: "4px 6px",
  };

  // Format date as YYYY-MM-DD for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div style={{
      maxWidth: 1300,
      margin: "40px auto",
      padding: 24,
      backgroundColor: "#fff",
      boxShadow,
      borderRadius,
      fontFamily,
    }}>
      {/* Back to Dashboard Button */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", marginBottom: 10 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#fff",
            color: "#1976d2",
            border: "1px solid #1976d2",
            borderRadius: 6,
            padding: "7px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            marginRight: 16,
            boxShadow: "0 2px 8px rgba(25,118,210,0.07)",
            transition: "background 0.2s",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
      <h1 style={{
        textAlign: "center",
        marginBottom: 24,
        color: colorPrimary,
        fontWeight: 700,
        fontSize: 28,
      }}>
        Labour Payment
      </h1>
      {/* Controls */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <select
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "14px",
              minWidth: "100px",
            }}
            value={selectedYear || ""}
            onChange={handleYearChange}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "14px",
              minWidth: "100px",
            }}
            value={selectedWeek?.id || ""}
            onChange={handleWeekChange}
            disabled={!selectedYear || weeks.length === 0}
          >
            <option value="">{weeks.length === 0 ? "No weeks for " + selectedYear : "Week..."}</option>
            {weeks.map((w) => (
              <option key={w.id} value={w.id}>
                {`Week ${w.weekNumber} (${formatDate(w.startDate)})–(${formatDate(w.endDate)})`}
              </option>
            ))}
          </select>
          <select
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "14px",
              minWidth: "100px",
            }}
            value={selectedRole}
            onChange={handleRoleChange}
          >
            {LABOR_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div style={{
          fontSize: "16px",
          fontWeight: "500",
          color: "#333",
          minWidth: "240px",
          textAlign: "right",
        }}>
          {selectedWeek
            ? `Start: ${formatDate(selectedWeek.startDate)} – End: ${formatDate(selectedWeek.endDate)}`
            : (selectedYear && weeks.length === 0 ? "No weeks for " + selectedYear : "Select a year and week")}
        </div>
      </div>
      {/* Table */}
      <div style={{
        overflowX: "auto",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        borderRadius: borderRadius,
        border: "1px solid #e9ecef",
        margin: "20px 0",
      }}>
        <table cellPadding="8" style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          borderRadius: borderRadius,
        }}>
          <thead>
            <tr style={headerStyle}>
              <th>Name</th>
              <th>No.Shifts</th>
              <th>Amount per Shift</th>
              <th>Total</th>
              <th>Food amount</th>
              <th>Advance amount</th>
              <th>Last Wk Bal.</th>
              <th>Last Wk Ret.</th>
              <th>Total</th>
              <th>Given</th>
              <th>Type</th>
              <th>Curr. Wk Bal.</th>
              <th>Curr. Wk Ret.</th>
              <th>Status</th>
              <th style={{ minWidth: "60px" }}>Action</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={15} style={{ textAlign: "center", padding: "20px" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: editMode[i] ? colorEditRow : "inherit",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <td style={{ textAlign: "left", paddingLeft: 16 }}>
                    {editMode[i] ? (
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleInputChange(i, "name", e.target.value)}
                        style={inputStyle}
                      />
                    ) : (
                      row.name
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={row.noShifts}
                      onChange={(e) => handleInputChange(i, "noShifts", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      value={row.ratePerShift}
                      onChange={(e) => handleInputChange(i, "ratePerShift", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    />
                  </td>
                  <td>{(row.noShifts * row.ratePerShift).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      value={row.foodAmount}
                      onChange={(e) => handleInputChange(i, "foodAmount", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      value={row.advanceAmount}
                      onChange={(e) => handleInputChange(i, "advanceAmount", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      value={row.lastWeekBalance}
                      onChange={(e) => handleInputChange(i, "lastWeekBalance", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      value={row.lastWeekReturn}
                      onChange={(e) => handleInputChange(i, "lastWeekReturn", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    />
                  </td>
                  <td>{row.totalCalculated.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      value={row.given}
                      onChange={(e) => handleInputChange(i, "given", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    />
                  </td>
                  <td>
                    <select
                      value={row.typeOfPayment}
                      onChange={(e) => handleInputChange(i, "typeOfPayment", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    >
                      {paymentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td>{row.currentWeekBalance.toFixed(2)}</td>
                  <td>{row.currentWeekReturn.toFixed(2)}</td>
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => handleInputChange(i, "status", e.target.value)}
                      style={inputStyle}
                      disabled={!editMode[i]}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <button
                        onClick={() => toggleEdit(i)}
                        style={{
                          padding: "4px 12px",
                          background: editMode[i] ? colorSuccess : colorPrimary,
                          color: colorTextLight,
                          border: "none",
                          borderRadius: borderRadius,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          boxShadow,
                        }}
                        disabled={row.name === "New Labourer" && !row.name}
                      >
                        {editMode[i] ? "Save" : "Edit"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabourPayment;
