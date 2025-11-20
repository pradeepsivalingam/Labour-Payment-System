import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialExpensesTemplate = {
  name: "",
  amounts: Array(7).fill(""),
  isEditing: false,
};

function getDistinctYears(weeks) {
  const years = new Set(weeks.map((week) => week.year));
  return Array.from(years).sort((a, b) => b - a);
}

function getWeeksForYear(weeks, year) {
  return weeks.filter((week) => week.year === year);
}

function getCurrentOrLatestWeek(weeks, today) {
  if (weeks.length === 0) return null;
  const currentWeek = weeks.find(
    (week) => new Date(week.startDate) <= today && new Date(week.endDate) >= today
  );
  return currentWeek ? currentWeek : weeks[0];
}

function getRowTotal(amounts) {
  return amounts.reduce((sum, val) => sum + parseFloat(val || 0), 0);
}

function getWeekStart(date) {
  const copy = new Date(date);
  const day = copy.getDay();
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatReadable(date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDayDates(startDate) {
  const date = new Date(startDate);
  return Array(7)
    .fill()
    .map((_, i) => {
      const dayDate = new Date(date);
      dayDate.setDate(date.getDate() + i);
      return formatReadable(dayDate);
    });
}

function formatWeekRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startStr = processDateToYMD(start);
  const endStr = processDateToYMD(end);
  return `${startStr}–${endStr}`;
}

function processDateToYMD(date) {
  return date.toISOString().slice(0, 10);
}

const styles = {
  container: {
    maxWidth: 1350,
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
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 16,
    marginBottom: 16,
    transition: "background-color 0.2s ease",
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
    marginBottom: 20,
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
  tdName: {
    textAlign: "left",
  },
  input: {
    width: "100%",
    maxWidth: 90,
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
  rowHover: {
    backgroundColor: "#fbfbfb",
  },
  footerRow: {
    fontWeight: "bold",
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 32,
    display: "flex",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    padding: "10px 22px",
    fontSize: 15,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 0.3s ease",
  },
  addButton: {
    backgroundColor: "#2e86de",
    color: "white",
  },
  saveButton: {
    backgroundColor: "#27ae60",
    color: "white",
  },
  editButton: {
    backgroundColor: "#f39c12",
    color: "white",
  },
  cancelButton: {
    backgroundColor: "#c0392b",
    color: "white",
  },
  removeButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 20,
    color: "#e53e3e",
    padding: "4px 8px",
    borderRadius: 6,
    transition: "color 0.2s ease",
  },
  removeCol: {
    width: 70,
    textAlign: "center",
  },
};

function FoodExpenses() {
  const navigate = useNavigate();
  const [allWeeks, setAllWeeks] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [dayDates, setDayDates] = useState(weekDays.map(() => ""));
  const [expenses, setExpenses] = useState([{ ...initialExpensesTemplate, isEditing: true }]);
  const API_URL = "http://localhost:8080/api/food-expenses";
  const WEEKS_API_URL = "http://localhost:8080/api/weeks";

  useEffect(() => {
    fetch(WEEKS_API_URL)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((weeksData) => {
        setAllWeeks(weeksData);
        const distinctYears = getDistinctYears(weeksData);
        setYears(distinctYears);
        const currentYear = new Date().getFullYear();
        const defaultYear = distinctYears.includes(currentYear) ? currentYear : distinctYears[0];
        setSelectedYear(defaultYear);
      })
      .catch((error) => {
        console.error("Failed to fetch weeks:", error);
        alert("Failed to fetch weeks.");
      });
  }, []);

  useEffect(() => {
    if (selectedYear === null) {
      setWeeks([]);
      setSelectedWeek(null);
    } else {
      const weeksForYear = getWeeksForYear(allWeeks, selectedYear);
      setWeeks(weeksForYear);
      const today = new Date();
      const currentWeek = getCurrentOrLatestWeek(weeksForYear, today);
      setSelectedWeek(currentWeek);
    }
  }, [selectedYear, allWeeks]);

  useEffect(() => {
    if (selectedWeek) {
      setDayDates(getDayDates(selectedWeek.startDate));
    } else {
      setDayDates(weekDays.map(() => ""));
    }
  }, [selectedWeek]);

  useEffect(() => {
    if (expenses.length === 0) {
      setExpenses([{ ...initialExpensesTemplate, isEditing: true }]);
    }
  }, [expenses]);

  const fetchExpenses = useCallback(() => {
    if (!selectedWeek) {
      setExpenses([{ ...initialExpensesTemplate, isEditing: true }]);
      return;
    }
    fetch(`${API_URL}?weekStartDate=${formatDate(new Date(selectedWeek.startDate))}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const formattedExpenses = data.map((item) => ({
            id: item.id,
            name: item.name,
            amounts: [
              item.amountSun,
              item.amountMon,
              item.amountTue,
              item.amountWed,
              item.amountThu,
              item.amountFri,
              item.amountSat,
            ].map((amount) => (amount !== null ? String(amount) : "")),
            isEditing: false,
          }));
          setExpenses(formattedExpenses);
        } else {
          setExpenses([{ ...initialExpensesTemplate, isEditing: true }]);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Could not fetch expenses. Please try again.");
      });
  }, [selectedWeek]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const updateExpense = (index, field, value, dayIdx = null) => {
    const newExpenses = [...expenses];
    if (field === "name") {
      newExpenses[index].name = value;
    } else if (field === "amounts" && dayIdx != null) {
      if (value === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
        newExpenses[index].amounts[dayIdx] = value;
      }
    }
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { ...initialExpensesTemplate, isEditing: true }]);
  };

  const toggleEdit = (index, enable) => {
    const newExpenses = [...expenses];
    newExpenses[index].isEditing = enable;
    setExpenses(newExpenses);
  };

  const saveRow = (index) => toggleEdit(index, false);
  const cancelEdit = (index) => toggleEdit(index, false);

  const removeRow = async (index) => {
    const expense = expenses[index];
    if (!expense.id) {
      setExpenses(expenses.filter((_, i) => i !== index));
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this record from the database?"
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${expense.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      setExpenses(expenses.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not delete expense. Please try again.");
    }
  };

  const getTotalAll = () =>
    expenses.reduce((sum, expense) => sum + getRowTotal(expense.amounts), 0);

  const saveAllChanges = async () => {
    if (!selectedWeek) {
      alert("Please select a week before saving changes.");
      return;
    }
    const validExpenses = expenses.filter(
      (exp) => exp.name.trim() || exp.amounts.some((amt) => amt)
    );
    const payload = validExpenses.map((exp) => ({
      id: exp.id,
      weekStartDate: formatDate(new Date(selectedWeek.startDate)),
      name: exp.name.trim(),
      amountSun: parseFloat(exp.amounts[0] || 0),
      amountMon: parseFloat(exp.amounts[1] || 0),
      amountTue: parseFloat(exp.amounts[2] || 0),
      amountWed: parseFloat(exp.amounts[3] || 0),
      amountThu: parseFloat(exp.amounts[4] || 0),
      amountFri: parseFloat(exp.amounts[5] || 0),
      amountSat: parseFloat(exp.amounts[6] || 0),
      totalAmount: parseFloat(getRowTotal(exp.amounts).toFixed(2)),
    }));
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to save expenses");
      }
      const saved = await response.json();
      const formattedExpenses = saved.map((item) => ({
        id: item.id,
        name: item.name,
        amounts: [
          item.amountSun,
          item.amountMon,
          item.amountTue,
          item.amountWed,
          item.amountThu,
          item.amountFri,
          item.amountSat,
        ].map((amount) => (amount !== null ? String(amount) : "")),
        isEditing: false,
      }));
      setExpenses(formattedExpenses);
      alert("Food expenses saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Could not save expenses. Please try again.");
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : null);
  };

  const handleWeekChange = (e) => {
    const weekId = parseInt(e.target.value, 10);
    setSelectedWeek(weeks.find((w) => w.id === weekId));
  };

  const weekEnd = selectedWeek ? new Date(selectedWeek.endDate) : null;
  const weekRangeStr = selectedWeek
    ? `${formatReadable(new Date(selectedWeek.startDate))} — ${formatReadable(weekEnd)}`
    : "Select a year and week";

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/dashboard")}
        style={styles.backButton}
        aria-label="Back to Dashboard"
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>←</span> Back to Dashboard
      </button>
      <h2 style={styles.heading}>Food Expenses</h2>
      <div style={styles.controlsContainer}>
        <div style={styles.selectContainer}>
          <label htmlFor="year-select">Year:</label>
          <select
            id="year-select"
            style={styles.select}
            onChange={handleYearChange}
            value={selectedYear === null ? "" : selectedYear}
            aria-label="Select a year"
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label htmlFor="week-select">Week:</label>
          <select
            id="week-select"
            style={styles.select}
            onChange={handleWeekChange}
            value={selectedWeek?.id ?? ""}
            disabled={!selectedYear || weeks.length === 0}
            aria-label="Select a week"
          >
            <option value="">
              {weeks.length === 0
                ? "No weeks for " + selectedYear
                : "Select a week"}
            </option>
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                Week {week.weekNumber} ({formatWeekRange(week.startDate, week.endDate)})
              </option>
            ))}
          </select>
        </div>
        <div style={styles.dateDisplay}>
          {selectedWeek
            ? weekRangeStr
            : selectedYear && weeks.length === 0
            ? "No weeks for " + selectedYear
            : "Please select a year and week"}
        </div>
      </div>
      <table style={styles.table} aria-label="Food expenses table">
        <thead>
          <tr>
            <th style={{ ...styles.th, maxWidth: 180 }}>Item/Name</th>
            {weekDays.map((day, idx) => (
              <th key={day} style={styles.th}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{day}</span>
                  <small style={{ color: "#777", fontSize: "0.8em" }}>{dayDates[idx]}</small>
                </div>
              </th>
            ))}
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Actions</th>
            <th style={styles.th}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, idx) => {
            const editing = expense.isEditing;
            return (
              <tr key={idx} style={idx % 2 === 1 ? styles.rowHover : undefined}>
                <td style={{ ...styles.td, ...styles.tdName, maxWidth: 180 }}>
                  <input
                    type="text"
                    aria-label={`Name for expense ${idx + 1}`}
                    value={expense.name}
                    onChange={(e) => editing && updateExpense(idx, "name", e.target.value)}
                    placeholder="Enter name"
                    style={{ ...styles.input, ...styles.inputName }}
                    disabled={!editing}
                  />
                </td>
                {expense.amounts.map((val, dayIdx) => (
                  <td key={dayIdx} style={styles.td}>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      aria-label={`Amount for ${weekDays[dayIdx]} for expense ${idx + 1}`}
                      value={val}
                      onChange={(e) =>
                        editing && updateExpense(idx, "amounts", e.target.value, dayIdx)
                      }
                      placeholder="0.00"
                      style={styles.input}
                      disabled={!editing}
                    />
                  </td>
                ))}
                <td style={styles.td}>{getRowTotal(expense.amounts).toFixed(2)}</td>
                <td style={styles.td}>
                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => toggleEdit(idx, true)}
                      style={{ ...styles.button, ...styles.editButton }}
                      aria-label={`Edit expense row ${idx + 1}`}
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => saveRow(idx)}
                        style={{ ...styles.button, ...styles.saveButton, marginRight: 8 }}
                        aria-label={`Save expense row ${idx + 1}`}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelEdit(idx)}
                        style={{ ...styles.button, ...styles.cancelButton }}
                        aria-label={`Cancel edit for expense row ${idx + 1}`}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
                <td style={{ ...styles.td, ...styles.removeCol }}>
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      style={styles.removeButton}
                      aria-label={`Remove expense row ${idx + 1}`}
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          <tr style={styles.footerRow}>
            <td style={styles.td}>Total</td>
            <td colSpan={weekDays.length} style={styles.td}></td>
            <td style={styles.td}>{getTotalAll().toFixed(2)}</td>
            <td colSpan={2} style={styles.td}></td>
          </tr>
        </tbody>
      </table>
      <div style={styles.buttonContainer}>
        <button
          onClick={addExpense}
          style={{ ...styles.button, ...styles.addButton }}
          aria-label="Add new food expense row"
        >
          Add Expense
        </button>
        <button
          onClick={saveAllChanges}
          style={{ ...styles.button, ...styles.saveButton }}
          aria-label="Save all food expenses changes"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default FoodExpenses;
