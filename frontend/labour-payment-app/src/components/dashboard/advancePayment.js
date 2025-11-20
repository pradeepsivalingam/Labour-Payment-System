import React, { useState, useEffect } from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";

// --- Match DailyWorkUpdates.js UI ---
const styles = {
  container: {
    maxWidth: 1300,
    margin: "40px auto",
    padding: 24,
    backgroundColor: "#fff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    borderRadius: 8,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: 24,
    fontWeight: 700,
    fontSize: 28,
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  selectContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minWidth: "100px",
  },
  dateDisplay: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
    minWidth: "240px",
    textAlign: "right",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    marginBottom: 16,
  },
  th: {
    borderBottom: "2px solid #ccc",
    padding: "12px 10px",
    color: "#555",
    backgroundColor: "#f5f7fa",
    textAlign: "center",
    fontWeight: 600,
    userSelect: "none",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #eaeaea",
    textAlign: "center",
    verticalAlign: "middle",
  },
  tdName: { textAlign: "left" },
  input: {
    width: "100%",
    maxWidth: 120,
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ddd",
    fontSize: 14,
    textAlign: "center",
  },
  inputName: {
    width: 180,
    textAlign: "left",
  },
  footerRow: { fontWeight: "bold", backgroundColor: "#f9f9f9" },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: 18,
    padding: "10px 0 12px",
  },
  button: {
    padding: "6px 14px",
    fontSize: 14,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 0.3s ease",
    marginRight: 5,
    fontWeight: 600,
  },
  addButton: { backgroundColor: "#2e86de", color: "white" },
  saveButton: { backgroundColor: "#27ae60", color: "white" },
  editButton: { backgroundColor: "#f39c12", color: "white" },
  removeCol: { width: 50, textAlign: "center" },
  removeButton: {
    backgroundColor: "#e84545",
    color: "white",
    borderRadius: "6px",
    border: "none",
    fontSize: "21px",
    padding: "7px 11px",
    lineHeight: 1,
    verticalAlign: "middle",
    cursor: "pointer",
    marginLeft: 0,
    transition: "background 0.22s",
  },
  totalSection: {
    textAlign: "center",
    marginTop: "18px",
    fontWeight: 700,
    fontSize: "23px",
    color: "#d72660",
    background: "rgba(255,255,255,0.89)",
    padding: "13px 30px",
    borderRadius: "15px",
    boxShadow: "0 3px 18px rgba(56,56,56,0.07)",
  },
  pageTitle: {
    fontWeight: 800,
    fontSize: "32px",
    letterSpacing: ".01em",
    color: "#202044",
    marginBottom: 10,
    textShadow: "0 2px 8px rgba(46,134,222,0.08)",
    textAlign: "center",
  },
  batchSaveButton: {
    backgroundColor: "#27ae60",
    color: "white",
    padding: "14px 22px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "14px",
    boxShadow: "0 3px 18px rgba(56,56,56,0.07)",
  },
};

const LABOR_ROLES = ["Mason", "Helper"];

function AdvancePaymentTable() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [allWeeks, setAllWeeks] = useState([]);
  const [years, setYears] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [changes, setChanges] = useState([]);
  const navigate = useNavigate();

  // Fetch all weeks (from MySQL weeks table)
  useEffect(() => {
    fetch("http://localhost:8080/api/weeks")
      .then((res) => res.json())
      .then((data) => {
        setAllWeeks(data);
        const distinctYears = [...new Set(data.map(week => week.year))].sort((a, b) => b - a);
        setYears(distinctYears);
        // Auto-select current year if available, or first available
        const currentYear = new Date().getFullYear();
        let defaultYear = distinctYears.includes(currentYear) ? currentYear : distinctYears[0];
        if (defaultYear === undefined) defaultYear = null;
        setSelectedYear(defaultYear);
      })
      .catch(console.error);
  }, []);

  // Filter weeks for selected year
  useEffect(() => {
    if (selectedYear === null) {
      setWeeks([]);
      setSelectedWeek(null);
    } else {
      const yearWeeks = allWeeks.filter(w => w.year === selectedYear);
      setWeeks(yearWeeks);
      // Auto-select current week if available, else the latest available
      const today = new Date();
      const currentWeek = yearWeeks.find(week =>
        new Date(week.startDate) <= today && new Date(week.endDate) >= today
      );
      setSelectedWeek(currentWeek || (yearWeeks.length > 0 ? yearWeeks[0] : null));
    }
  }, [selectedYear, allWeeks]);

  // Fetch payments with filters
  useEffect(() => {
    if (!selectedYear) {
      setPayments([]);
      return;
    }
    setLoading(true);
    let url = "http://localhost:8080/api/advance-payment";
    const params = [];
    if (selectedYear) params.push(`year=${selectedYear}`);
    if (selectedWeek) params.push(`week=${selectedWeek.weekNumber}`);
    if (selectedRole) params.push(`role=${selectedRole}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPayments(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, [selectedYear, selectedWeek, selectedRole]);

  // Handle changes
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

  // Add new row
  const addNew = () => {
    const newRow = {
      id: Date.now(),
      name: "",
      amount: "",
      role: selectedRole || LABOR_ROLES[0],
      date: new Date().toISOString().split('T')[0],
      year: selectedYear,
      weekNumber: selectedWeek?.weekNumber,
      __isNew: true,
    };
    setPayments([newRow, ...payments]);
    setEditingId(newRow.id);
    setChanges([...changes, newRow]);
  };

  // Start/cancel editing
  const startEdit = (id) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);

  // Remove row (marks for deletion or removes if new)
  const removeRow = (id) => {
    const isNew = payments.some(p => p.id === id && p.__isNew);
    if (isNew) {
      setPayments(payments.filter(p => p.id !== id));
      setChanges(changes.filter(c => c.id !== id));
    } else {
      setDeletedIds(new Set([...deletedIds, id]));
    }
  };

  // Handle field value changes
  const handleChange = (id, key, value) => {
    const updated = payments.map((p) =>
      p.id === id
        ? { ...p, [key]: value, ...(key === "date" && {
            year: new Date(value).getFullYear(),
            weekNumber: getWeekNumber(new Date(value)),
          })}
        : p
    );
    setPayments(updated);
    const existingChangeIndex = changes.findIndex(c => c.id === id);
    if (existingChangeIndex >= 0) {
      const updatedChanges = [...changes];
      updatedChanges[existingChangeIndex] = updated.find(p => p.id === id);
      setChanges(updatedChanges);
    } else {
      setChanges([...changes, updated.find(p => p.id === id)]);
    }
  };

  // Helper: Week number from date (if you do not use MySQL weeks table)
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  };

  // Compute total
  const totalAmount = (Array.isArray(payments) ? payments : []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Batch save all changes
  const saveChanges = () => {
    const toSave = [...changes].filter(c => !deletedIds.has(c.id));
    const toDelete = [...deletedIds].filter(id => !payments.some(p => p.__isNew && p.id === id));
    if (toSave.length === 0 && toDelete.length === 0) {
      alert("No changes to save.");
      return;
    }

    const payload = {
        save: toSave.map(c => ({ ...c, year: selectedYear, weekNumber: selectedWeek?.weekNumber })),
        delete: toDelete,
    };

    fetch("http://localhost:8080/api/advance-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          setDeletedIds(new Set());
          setEditingId(null);
          setChanges([]);
          // Refresh with current filters
          if (selectedYear) {
            let url = "http://localhost:8080/api/advance-payment";
            const params = [];
            if (selectedYear) params.push(`year=${selectedYear}`);
            if (selectedWeek) params.push(`week=${selectedWeek.weekNumber}`);
            if (selectedRole) params.push(`role=${selectedRole}`);
            if (params.length > 0) url += `?${params.join('&')}`;
            fetch(url)
              .then((res) => res.json())
              .then((data) => setPayments(data))
              .catch(console.error);
          }
        } else {
          throw new Error("Error saving data");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Format date as YYYY-MM-DD for display
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div style={styles.container}>
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
      <h1 style={styles.heading}>Advance Payment</h1>
      <div style={styles.controlsContainer}>
        <div style={styles.selectContainer}>
          <select
            style={styles.select}
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
            style={styles.select}
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
          <select style={styles.select} value={selectedRole} onChange={handleRoleChange}>
            <option value="">All Roles</option>
            {LABOR_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.dateDisplay}>
          {selectedWeek
            ? `Start: ${new Date(selectedWeek.startDate).toLocaleDateString('en-CA')} – End: ${new Date(selectedWeek.endDate).toLocaleDateString('en-CA')}`
            : (selectedYear && weeks.length === 0 ? "No weeks for " + selectedYear : "Select a year and week")}
        </div>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Amount (₹)</th>
            <th style={styles.th}>Date</th>
            <th style={{ ...styles.th, ...styles.removeCol }}>Edit</th>
            <th style={{ ...styles.th, ...styles.removeCol }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                Loading...
              </td>
            </tr>
          ) : payments.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                No payments found.
              </td>
            </tr>
          ) : (
            payments.map((p) => {
              const isEditing = p.id === editingId;
              const isDeleted = deletedIds.has(p.id);
              if (isDeleted) return null;
              return (
                <tr
                  key={p.id}
                  style={p.id % 2 === 1 ? { background: "#f8fafc" } : undefined}
                >
                  <td style={{ ...styles.td, ...styles.tdName }}>
                    <input
                      style={{ ...styles.input, ...styles.inputName }}
                      type="text"
                      value={p.name}
                      onChange={(e) => handleChange(p.id, "name", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Name"
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      type="number"
                      value={p.amount}
                      onChange={(e) => handleChange(p.id, "amount", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Amount"
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      type="date"
                      value={p.date || ""}
                      onChange={(e) => handleChange(p.id, "date", e.target.value)}
                      disabled={!isEditing}
                    />
                  </td>
                  <td style={styles.td}>
                    {isEditing ? (
                      <button
                        style={{ ...styles.button, ...styles.saveButton, marginRight: 8 }}
                        onClick={cancelEdit}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        style={{ ...styles.button, ...styles.editButton }}
                        onClick={() => startEdit(p.id)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                  <td style={{ ...styles.td, ...styles.removeCol }}>
                    <button
                      style={styles.removeButton}
                      onClick={() => removeRow(p.id)}
                      title="Remove"
                      aria-label="Remove"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })
          )}
          <tr style={styles.footerRow}>
            <td colSpan={1}>Total</td>
            <td style={styles.td}>₹ {totalAmount.toLocaleString()}</td>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>
      <div style={styles.buttonRow}>
        <button
          style={{ ...styles.button, ...styles.addButton }}
          onClick={addNew}
        >
          Add New Payment
        </button>
        {(changes.length > 0 || deletedIds.size > 0) && (
          <button
            style={styles.batchSaveButton}
            onClick={saveChanges}
            disabled={loading}
          >
            Save All Changes
          </button>
        )}
      </div>
      <div style={styles.totalSection}>
        Total Advance Paid:{" "}
        <span style={{ color: "#219150" }}>₹ {totalAmount.toLocaleString()}</span>
      </div>
    </div>
  );
}

function AdvancePayment() {
  return (
    <>
      <Header />
      <AdvancePaymentTable />
    </>
  );
}

export default AdvancePayment;
