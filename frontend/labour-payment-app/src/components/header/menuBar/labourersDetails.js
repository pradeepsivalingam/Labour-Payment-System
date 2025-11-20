import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ========== API Endpoints ==========
const API_BASE_URL = "http://localhost:8080/api";
const WORKERS_URL = `${API_BASE_URL}/workers`;
const SUPERVISORS_URL = `${API_BASE_URL}/users`;

// ========== Role Types ==========
const labourTypes = [
  { label: "Mason", value: "MASON" },
  { label: "Helper", value: "HELPER" }
];

// ========== Form State ==========
const emptyForm = {
  name: "",
  mobile: "",
  role: "",
  amount: "",
  supervisor_id: ""
};

// ========== Styles ==========
const styles = {
  pageTitle: {
    padding: "32px 0 24px",
    textAlign: "center",
    fontWeight: 800,
    fontSize: 33,
    letterSpacing: 1,
    color: "#105fc4"
  },
  formContainer: {
    maxWidth: 450,
    background: "#fff",
    margin: "0 auto 32px",
    borderRadius: 13,
    boxShadow: "0 2px 22px 4px #1976d21e",
    padding: "32px 30px 23px",
    position: "relative",
    zIndex: 1
  },
  formTitle: {
    fontWeight: 700,
    marginBottom: 19,
    fontSize: 21,
    color: "#1565c0",
    letterSpacing: 0.5
  },
  row: { display: "flex", gap: 16, marginBottom: 16 },
  input: {
    flex: 2,
    padding: "11px 12px",
    borderRadius: 5,
    border: "1.5px solid #d1e4f7",
    fontSize: 16
  },
  select: {
    flex: 2,
    padding: "11px 12px",
    borderRadius: 5,
    border: "1.5px solid #d1e4f7",
    fontSize: 16,
    background: "#f5fbff",
    color: "#08377a",
    fontWeight: 500
  },
  submitButton: {
    background: "linear-gradient(95deg,#1976d2 0%, #1491e7 98%)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 30px",
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: "1px",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(20,100,200,.07)"
  },
  cancelButton: {
    background: "#cedcf3",
    color: "#045cce",
    border: "none",
    borderRadius: 6,
    padding: "10px 20px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 1px 7px rgba(0,80,180,.04)"
  },
  tableContainer: {
    maxWidth: 770,
    margin: "0 auto 33px",
    background: "#ffffffee",
    borderRadius: 12,
    boxShadow: "0 1.5px 14px 1px #1565c019",
    padding: "16px 19px 21px 19px"
  },
  tableTitle: {
    fontWeight: 700,
    fontSize: 18,
    color: "#1976d2",
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.1
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    background: "#fff"
  },
  tableHeadCell: {
    padding: "10px 6px",
    fontWeight: 700,
    fontSize: 15.5,
    color: "#1357af",
    textAlign: "center",
    borderBottom: "2px solid #bbd7f2"
  },
  tableCell: {
    padding: "10px 4px",
    fontSize: 15.2,
    textAlign: "center",
    borderBottom: "1px solid #f0f1f4"
  },
  emptyRow: {
    textAlign: "center",
    color: "#97a8c1",
    fontSize: 15,
    padding: 30,
    fontWeight: 600,
    letterSpacing: 0.2
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0d47a1",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "12px 24px",
    margin: "16px 0 0 32px",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.13)",
    transition: "background 0.2s ease"
  },
  saveChangesButton: {
    position: "fixed",
    top: 20,
    right: 32,
    background: "linear-gradient(95deg,#1976d2 0%, #1491e7 98%)",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 24px",
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: "1px",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(20,100,200,.07)",
    zIndex: 1000,
    transition: "opacity 0.2s ease"
  },
  loading: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5fbff 0%, #e8f1fc 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, Roboto, Arial, sans-serif"
  }
};

function actionBtn(bg, color) {
  return {
    border: "none",
    borderRadius: 4,
    fontWeight: 700,
    padding: "7px 17px",
    fontSize: 14.5,
    background: bg,
    color: color,
    letterSpacing: 0.2,
    cursor: "pointer",
    margin: "1.5px 2.5px",
    boxShadow: "0 1px 4px rgba(45,80,160,0.09)",
    outline: "none",
    transition: "background 0.21s"
  };
}

// ========== CHOOSE ONE ==========
// Use this if your backend returns `supervisor_id` and a separate `supervisors` array from `/api/users`
function getSupervisorName(worker, supervisors) {
  if (!worker.supervisor_id) return "-";
  const supervisor = supervisors.find((s) => s.id === worker.supervisor_id);
  if (!supervisor) return "-";
  return supervisor.username || "-";
}

// Use this instead if your backend returns the full supervisor object in each worker
// function getSupervisorName(worker) {
//   return worker.supervisor ? worker.supervisor.name : "-";
// }
// Be sure to adjust your <td> in TableBlock accordingly:
// <td style={styles.tableCell}>{getSupervisorName(row)}</td>

function TableBlock({
  title,
  data,
  editLabel,
  onEdit,
  onDelete,
  emptyMsg,
  supervisors,
  isHelper = false
}) {
  // Use this version if your backend returns `supervisor_id` (default)
  // Change to `{getSupervisorName(row)}` if your backend returns the full object
  const getDisplaySupervisor = (row) => getSupervisorName(row, supervisors);

  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableTitle}>{title}</div>
      <table style={styles.table}>
        <thead>
          <tr style={{ background: "#e3f2fd" }}>
            <th style={styles.tableHeadCell}>S.No</th>
            <th style={styles.tableHeadCell}>{isHelper ? "Helper Name" : "Mason Name"}</th>
            <th style={styles.tableHeadCell}>Mobile number</th>
            <th style={styles.tableHeadCell}>Amount Per Shift</th>
            <th style={styles.tableHeadCell}>Supervisor</th>
            <th style={styles.tableHeadCell}>Edit</th>
            <th style={styles.tableHeadCell}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} style={styles.emptyRow}>{emptyMsg}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id}
                style={{ background: i % 2 === 0 ? "#fafdff" : "#f1f6fa" }}
              >
                <td style={styles.tableCell}>{i + 1}</td>
                <td style={styles.tableCell}>{row.name}</td>
                <td style={styles.tableCell}>{row.mobile ?? "-"}</td>
                <td style={styles.tableCell}>₹{row.amount}</td>
                <td style={styles.tableCell}>{getDisplaySupervisor(row)}</td>
                <td style={styles.tableCell}>
                  <button
                    style={actionBtn("#2e81f7", "#fff")}
                    onClick={() => onEdit?.(row)}
                  >
                    ✏️ {editLabel}
                  </button>
                </td>
                <td style={styles.tableCell}>
                  <button
                    style={actionBtn("#e53935", "#fff")}
                    onClick={() => onDelete?.(row.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function LabourersDetailsPage() {
  const navigate = useNavigate();
  const [labourers, setLabourers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // ======== Data Fetching ========
  useEffect(() => {
    console.log("=== Loading initial data ===");
    
    // Fetch workers
    console.log("Fetching workers from:", WORKERS_URL);
    axios.get(WORKERS_URL)
      .then((res) => {
        // Handle both response formats: {data: [...]} or [...]
        const workersData = res.data.data || res.data || [];
        console.log("Workers API response:", res.data);
        console.log("Workers data extracted:", workersData);
        setLabourers(workersData);
      })
      .catch((err) => {
        console.error("Error fetching workers:", err.response || err);
        setLabourers([]);
      });

    // Fetch supervisors with better error handling
    console.log("Fetching supervisors from:", SUPERVISORS_URL);
    axios.get(SUPERVISORS_URL)
      .then((res) => {
        // Handle both response formats: {data: [...]} or [...]
        const allUsers = res.data.data || res.data || [];
        // Filter only supervisors on the client side
        const supervisorsData = allUsers.filter(user => user.userType === 'SUPERVISOR');
        console.log("All users from API:", allUsers);
        console.log("Filtered supervisors:", supervisorsData);
        setSupervisors(supervisorsData);
      })
      .catch((err) => {
        console.error("Error fetching supervisors:", err.response || err);
        setSupervisors([]);
      });
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, mobile, role, amount, supervisor_id } = form;

    if (!name || !mobile || !role || !amount || !supervisor_id) {
      alert("Please fill all fields.");
      return;
    }

    const payload = { name, mobile, role, amount, supervisor_id };
    console.log("Submitting payload:", payload);

    if (editId !== null) {
      // Update Worker
      console.log("Updating worker with ID:", editId);
      axios.put(`${WORKERS_URL}/${editId}`, payload)
        .then((response) => {
          console.log("Update response:", response.data);
          return axios.get(WORKERS_URL);
        })
        .then((response) => {
          console.log("Workers after update:", response.data);
          const workersData = response.data.data || response.data || [];
          setLabourers(workersData);
          resetForm();
          alert("Worker updated successfully");
        })
        .catch((err) => {
          console.error("Failed to update worker:", err.response || err);
          alert("Failed to update worker: " + (err.response?.data?.message || err.message));
        });
    } else {
      // Add Worker
      console.log("Adding new worker");
      axios.post(WORKERS_URL, payload)
        .then((response) => {
          console.log("Add response:", response.data);
          return axios.get(WORKERS_URL);
        })
        .then((response) => {
          console.log("Workers after add:", response.data);
          const workersData = response.data.data || response.data || [];
          setLabourers(workersData);
          resetForm();
          alert("Worker added successfully");
        })
        .catch((err) => {
          console.error("Failed to add worker:", err.response || err);
          alert("Failed to add worker: " + (err.response?.data?.message || err.message));
        });
    }
  };

  const handleEdit = (worker) => {
    setForm(worker);
    setEditId(worker.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this worker?")) return;
    console.log("Deleting worker with ID:", id);
    axios.delete(`${WORKERS_URL}/${id}`)
      .then((response) => {
        console.log("Delete response:", response.data);
        return axios.get(WORKERS_URL);
      })
      .then((response) => {
        console.log("Workers after delete:", response.data);
        const workersData = response.data.data || response.data || [];
        setLabourers(workersData);
      })
      .catch((err) => {
        console.error("Failed to delete worker:", err.response || err);
        alert("Failed to delete worker: " + (err.response?.data?.message || err.message));
      });
  };

  // ======== Derived Data ========
  // Use .toUpperCase() to be case-insensitive (e.g., if your backend is inconsistent)
  const masons = labourers.filter((w) => w.role?.toUpperCase() === "MASON");
  const helpers = labourers.filter((w) => w.role?.toUpperCase() === "HELPER");
  
  console.log("=== Derived Data ===");
  console.log("All labourers:", labourers);
  console.log("Masons:", masons);
  console.log("Helpers:", helpers);

  // Check if form is changed relative to original
  const isFormChanged =
    editId !== null &&
    (form.name !== labourers.find((l) => l.id === editId)?.name ||
      form.mobile !== labourers.find((l) => l.id === editId)?.mobile ||
      form.role !== labourers.find((l) => l.id === editId)?.role ||
      form.amount !== labourers.find((l) => l.id === editId)?.amount ||
      form.supervisor_id !== labourers.find((l) => l.id === editId)?.supervisor_id);

  // ======== Render ========
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5fbff 0%, #e8f1fc 100%)",
      fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
      paddingBottom: 40
    }}>
      {/* Save Changes Floating Button (when editing) */}
      {editId !== null && (
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            ...styles.saveChangesButton,
            opacity: isFormChanged ? 1 : 0.5,
            cursor: isFormChanged ? "pointer" : "not-allowed",
          }}
          disabled={!isFormChanged}
          aria-label="Save Changes"
          title={isFormChanged ? "Save Changes" : "No changes to save"}
        >
          Save Changes
        </button>
      )}

      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={styles.backButton}
        aria-label="Back to Dashboard"
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>←</span> Back to Dashboard
      </button>

      {/* Page Title */}
      <div style={styles.pageTitle}>Labourers Details</div>

      {/* Form (Add/Edit) */}
      <div style={styles.formContainer}>
        <div style={styles.formTitle}>
          {editId !== null ? "Edit Member" : "Add a Member"}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Name"
              style={styles.input}
              required
            />
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleFormChange}
              placeholder="Mobile number"
              style={styles.input}
              required
              pattern="[0-9]{10,12}"
              title="Please enter a valid 10-12 digit mobile number"
            />
          </div>
          <div style={styles.row}>
            <select
              name="role"
              value={form.role}
              onChange={handleFormChange}
              style={styles.select}
              required
            >
              <option value="">Select Role</option>
              {labourTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleFormChange}
              placeholder="Amount per shift (₹)"
              style={styles.input}
              required
              min={1}
            />
          </div>
          <div style={styles.row}>
            <select
              name="supervisor_id"
              value={form.supervisor_id}
              onChange={handleFormChange}
              style={styles.select}
              required
            >
              <option value="">Select Supervisor</option>
              {supervisors.length === 0 ? (
                <option value="" disabled>No supervisors available ({supervisors.length})</option>
              ) : (
                supervisors.map((s) => {
                  const displayName = s.username || 'Unknown';
                  console.log("Rendering supervisor option:", s, "Display name:", displayName);
                  return (
                    <option key={s.id} value={s.id}>
                      {displayName}
                    </option>
                  );
                })
              )}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20 }}>
            <button type="submit" style={styles.submitButton}>
              {editId !== null ? "Update" : "Add"}
            </button>
            {editId !== null && (
              <button type="button" style={styles.cancelButton} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Mason Table */}
      <TableBlock
        title="Masons"
        data={masons}
        editLabel="Edit"
        onEdit={handleEdit}
        onDelete={handleDelete}
        supervisors={supervisors}
        emptyMsg="No masons added yet."
      />

      {/* Helper Table */}
      <TableBlock
        title="Helpers"
        data={helpers}
        editLabel="Edit"
        onEdit={handleEdit}
        onDelete={handleDelete}
        supervisors={supervisors}
        emptyMsg="No helpers added yet."
        isHelper
      />
    </div>
  );
}
