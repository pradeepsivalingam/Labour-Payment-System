import React, { useState, useEffect, useCallback } from "react";
import Header from "../header/header";
import { useNavigate } from "react-router-dom";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const shiftOptions = ["", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0"];
const roles = ["MASON", "HELPER"];

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
    maxWidth: 100,
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
  thDate: { fontSize: "12px", color: "#777", fontWeight: "400" },
  totalCell: { fontWeight: "bold", backgroundColor: "#f7fcf7" },
  footerRow: { fontWeight: "bold", backgroundColor: "#f9f9f9" },
  buttonContainer: {
    marginTop: 12,
    display: "flex",
    justifyContent: "center",
    gap: 16,
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
  },
  editButton: { backgroundColor: "#f39c12", color: "white" },
  saveButton: { backgroundColor: "#27ae60", color: "white" },
};

// Helpers for weeks
function getDistinctYears(weeks) {
  const years = new Set((Array.isArray(weeks) ? weeks : []).map((week) => week.year));
  return Array.from(years).sort((a, b) => b - a);
}

function getWeeksForYear(weeks, year) {
  return (Array.isArray(weeks) ? weeks : []).filter((week) => week.year === year);
}

function getCurrentOrLatestWeek(weeks, today) {
  const list = Array.isArray(weeks) ? weeks : [];
  if (list.length === 0) return null;
  const currentWeek = list.find(
    (week) => new Date(week.startDate) <= today && new Date(week.endDate) >= today
  );
  return currentWeek ? currentWeek : list[0];
}

function DailyWorkUpdates() {
  const [allWeeks, setAllWeeks] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [workUpdates, setWorkUpdates] = useState([]);
  const [selectedRole, setSelectedRole] = useState("MASON");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const toArray = (val) => (Array.isArray(val) ? val : []);

  // Fetch all weeks
  useEffect(() => {
    fetch("http://localhost:8080/api/weeks")
      .then((res) => res.json())
      .then((data) => {
        const weeksArray = Array.isArray(data?.data) ? data.data : toArray(data);
        setAllWeeks(weeksArray);
        const distinctYears = getDistinctYears(weeksArray);
        setYears(distinctYears);
        const currentYear = new Date().getFullYear();
        const defaultYear = distinctYears.includes(currentYear)
          ? currentYear
          : distinctYears.length > 0
          ? distinctYears[0]
          : null;
        setSelectedYear(defaultYear);
      })
      .catch((err) => {
        console.error("Failed to fetch weeks:", err);
        setAllWeeks([]);
        setYears([]);
        setSelectedYear(null);
      });
  }, []);

  // Filter weeks for the selected year
  useEffect(() => {
    if (selectedYear === null) {
      setWeeks([]);
      setSelectedWeek(null);
    } else {
      const yearWeeks = getWeeksForYear(allWeeks, selectedYear);
      setWeeks(yearWeeks);
      if (yearWeeks.length > 0) {
        const today = new Date();
        const currentWeek = getCurrentOrLatestWeek(yearWeeks, today);
        setSelectedWeek(currentWeek);
      } else {
        setSelectedWeek(null);
      }
    }
  }, [selectedYear, allWeeks]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : null);
  };

  const handleWeekChange = (e) => {
    const weekId = parseInt(e.target.value, 10);
    setSelectedWeek(weeks.find((w) => w.id === weekId));
  };

  const fetchWorkUpdates = useCallback(() => {
    if (!selectedWeek) {
      setWorkUpdates([]);
      return;
    }

    const userId = localStorage.getItem("userId");
    const updatesUrl = `http://localhost:8080/api/daily-work-updates?startDate=${selectedWeek.startDate}&endDate=${selectedWeek.endDate}&role=${selectedRole}`;
    const workersUrl = `http://localhost:8080/api/workers/supervisor/${userId}`;

    fetch(updatesUrl)
      .then((res) => res.json())
      .then((existingRaw) => {
        const existingData = Array.isArray(existingRaw?.data)
          ? existingRaw.data
          : toArray(existingRaw);

        fetch(workersUrl)
        .then((res) => res.json())
        .then((workersRaw) => {
          // Extract workers array from 'data' property
          const workers = Array.isArray(workersRaw?.data) ? workersRaw.data : toArray(workersRaw);
          // Merge: start from all workers, blend in existing data if present
          const allUpdates = workers.map((worker) => {
            const existingUpdate = existingData.find((d) => d.workerId === worker.id);
            if (existingUpdate) {
              return {
                id: existingUpdate.id ?? null,
                workerId: worker.id,
                name: existingUpdate.name ?? worker.name ?? "",
                role: existingUpdate.role ?? worker.role ?? selectedRole,
                shifts: [
                  existingUpdate.sunday ?? "",
                  existingUpdate.monday ?? "",
                  existingUpdate.tuesday ?? "",
                  existingUpdate.wednesday ?? "",
                  existingUpdate.thursday ?? "",
                  existingUpdate.friday ?? "",
                  existingUpdate.saturday ?? "",
                ],
              };
            } else {
              return {
                id: null,
                workerId: worker.id,
                name: worker.name ?? "",
                role: worker.role ?? selectedRole,
                shifts: ["", "", "", "", "", "", ""],
              };
            }
          });
          setWorkUpdates(allUpdates);
        })
        .catch((err) => {
          console.error("Failed to fetch workers:", err);
          // Fallback: show existing data only (existingData is normalized)
          const fallback = existingData.map((d) => ({
            id: d.id ?? null,
            workerId: d.workerId,
            name: d.name ?? "",
            role: d.role ?? selectedRole,
            shifts: [
              d.sunday ?? "",
              d.monday ?? "",
              d.tuesday ?? "",
              d.wednesday ?? "",
              d.thursday ?? "",
              d.friday ?? "",
              d.saturday ?? "",
            ],
          }));
          setWorkUpdates(fallback);
        })
          .catch((err) => {
            console.error("Failed to fetch workers:", err);
            setWorkUpdates(existingData);
          });
      })
      .catch((err) => {
        console.error("Failed to fetch daily work updates:", err);
        setWorkUpdates([]);
      });
  }, [selectedWeek, selectedRole]);

  useEffect(() => {
    fetchWorkUpdates();
  }, [fetchWorkUpdates]);

  const updateMemberState = (workerId, updates) => {
    setWorkUpdates((prev) =>
      toArray(prev).map((member) =>
        member.workerId === workerId ? { ...member, ...updates } : member
      )
    );
  };

  const handleShiftChange = (member, dayIdx, value) => {
    const newShifts = [...member.shifts];
    newShifts[dayIdx] = value;
    updateMemberState(member.workerId, { shifts: newShifts });
  };

  const handleNameChange = (member, value) => {
    updateMemberState(member.workerId, { name: value });
  };

  const saveAllChanges = () => {
  if (!selectedWeek) {
    alert("Please select a week before saving changes.");
    return;
  }

  const membersToSave = toArray(workUpdates).filter((m) => m.role === selectedRole);

  const totalShifts = (shifts) =>
    toArray(shifts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  const payload = membersToSave.map((m) => ({
    id: m.id,
    workerId: m.workerId,
    name: m.name,
    role: m.role,
    startDate: selectedWeek.startDate.slice(0, 10), // ensure yyyy-MM-dd
    endDate: selectedWeek.endDate.slice(0, 10),
    weekNumber: selectedWeek.weekNumber, // ✅ added
    year: new Date(selectedWeek.startDate).getFullYear(), // ✅ added
    sunday: parseFloat(m.shifts?.[0]) || 0,
    monday: parseFloat(m.shifts?.[1]) || 0,
    tuesday: parseFloat(m.shifts?.[2]) || 0,
    wednesday: parseFloat(m.shifts?.[3]) || 0,
    thursday: parseFloat(m.shifts?.[4]) || 0,
    friday: parseFloat(m.shifts?.[5]) || 0,
    saturday: parseFloat(m.shifts?.[6]) || 0,
    totalShifts: totalShifts(m.shifts),
  }));

  fetch("http://localhost:8080/api/daily-work-updates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (res.ok) {
        alert(`${selectedRole} data saved successfully!`);
        setEditing(false);
        fetchWorkUpdates();
      } else {
        throw new Error("Error saving data");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to save data.");
    });
};

  const getWeekDates = (startDate) => {
    if (!startDate) return [];
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedWeek?.startDate);
  const displayedMembers = toArray(workUpdates).filter((m) => m.role === selectedRole);
  const totalShiftsForMember = (shifts) =>
    toArray(shifts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  return (
    <>
      <Header />
      <div style={styles.container}>
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
        <h1 style={styles.heading}>Daily Work Updates</h1>

        <div style={styles.controlsContainer}>
          <div style={styles.selectContainer}>
            <label htmlFor="year-select">Year:</label>
            <select
              id="year-select"
              style={styles.select}
              onChange={handleYearChange}
              value={selectedYear === null ? "" : selectedYear}
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
            >
              <option value="">
                {weeks.length === 0 ? "No weeks for " + selectedYear : "Select a week"}
              </option>
              {weeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {`Week ${week.weekNumber} (${new Date(week.startDate).toLocaleDateString(
                    "en-CA"
                  )})–(${new Date(week.endDate).toLocaleDateString("en-CA")})`}
                </option>
              ))}
            </select>

            <label htmlFor="role-select">Role:</label>
            <select
              id="role-select"
              style={styles.select}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.dateDisplay}>
            {selectedWeek
              ? `Start: ${new Date(selectedWeek.startDate).toLocaleDateString("en-CA")} – End: ${new Date(
                  selectedWeek.endDate
                ).toLocaleDateString("en-CA")}`
              : selectedYear && weeks.length === 0
              ? "No weeks for " + selectedYear
              : "Please select a year and week"}
          </div>
        </div>

        {selectedWeek && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: 60 }}>S.No</th>
                <th style={{ ...styles.th, width: 160 }}>Name</th>
                {weekDays.map((day, index) => (
                  <th key={day} style={styles.th}>
                    <div>{day}</div>
                    <div style={styles.thDate}>
                      {weekDates[index] ? weekDates[index].toLocaleDateString("en-CA") : ""}
                    </div>
                  </th>
                ))}
                <th style={styles.th}>Total Shift</th>
              </tr>
            </thead>
            <tbody>
              {displayedMembers.map((member, index) => (
                <tr key={member.workerId ?? member.id ?? index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{ ...styles.td, ...styles.tdName }}>
                    {editing ? (
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleNameChange(member, e.target.value)}
                        placeholder="Enter name"
                        style={{ ...styles.input, ...styles.inputName }}
                      />
                    ) : (
                      <span style={{ padding: "0 8px", display: "inline-block", width: "100%" }}>
                        {member.name || "—"}
                      </span>
                    )}
                  </td>
                  {member.shifts.map((shift, dayIdx) => (
                    <td key={dayIdx} style={styles.td}>
                      {editing ? (
                        <select
                          value={shift}
                          onChange={(e) => handleShiftChange(member, dayIdx, e.target.value)}
                          style={styles.input}
                        >
                          {shiftOptions.map((sv) => (
                            <option key={sv} value={sv}>
                              {sv || "—"}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ padding: "0 8px", display: "inline-block", width: "100%" }}>
                          {shift || "—"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td style={{ ...styles.td, ...styles.totalCell }}>
                    {totalShiftsForMember(member.shifts).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr style={styles.footerRow}>
                <td style={styles.td}></td>
                <td style={styles.td}>Total Shift</td>
                {weekDays.map((_, idx) => (
                  <td key={idx} style={styles.td}></td>
                ))}
                <td style={{ ...styles.td, ...styles.totalCell }}>
                  {displayedMembers
                    .reduce((sum, m) => sum + totalShiftsForMember(m.shifts), 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <div style={styles.buttonContainer}>
          <button
            onClick={() => setEditing(!editing)}
            style={{ ...styles.button, ...styles.editButton }}
            disabled={!selectedWeek}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          {editing && (
            <button
              onClick={saveAllChanges}
              style={{ ...styles.button, ...styles.saveButton }}
              disabled={!selectedWeek}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default DailyWorkUpdates;

