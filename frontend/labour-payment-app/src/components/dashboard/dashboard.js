import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";

// Function that builds the dashboard items with userId
const dashboardItems = (userId) => [
  { title: "Daily Work Update", route: `/daily-work-update?userId=${userId}` },
  { title: "Advance Payment", route: `/advancePayment?userId=${userId}` },
  { title: "Food Expenses", route: `/foodExpenses?userId=${userId}` },
  { title: "Labour Payments", route: `/labourPayments?userId=${userId}` },
  { title: "Manager Payments", route: `/managerPayment?userId=${userId}` },
  { title: "Notifications", route: `/notifications?userId=${userId}` },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Get userId from query params
  const userId = localStorage.getItem("userId");


  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(120deg, #c6e2ff 0%, #fbc2eb 100%)",
          position: "relative",
        }}
      >
        {/* Optional overlay for a modern accent touch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(135deg, rgba(46,134,222, 0.12), rgba(251,194,235, 0.10) 60%, rgba(255,255,255,0.09) 100%)",
            zIndex: 0,
          }}
        />

        <main
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1000,
            margin: "0 auto",
            padding: "0 px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#222",
            minHeight: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 34,
              fontWeight: "700",
              marginBottom: 48,
              letterSpacing: "0.02em",
              color: "#202840",
              textShadow: "0 2px 8px rgba(46,134,222,0.10)",
            }}
          >
            Dashboard
          </h1>

          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "56px",
              width: "100%",
            }}
            aria-label="Dashboard navigation items"
          >
            {dashboardItems(userId).map(({ title, route }, idx) => {
              const isClickable = Boolean(route);

              return (
                <div
                  key={idx}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onClick={() => isClickable && navigate(route)}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === "Enter" || e.key === " ")) {
                      navigate(route);
                    }
                  }}
                  style={{
                    flex: "1 1 280px",
                    maxWidth: 320,
                    minHeight: 140,
                    background: isClickable
                      ? "linear-gradient(120deg, #eff6fb 70%, #e5d0fa 100%)"
                      : "#f5f5f5",
                    borderRadius: 16,
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.10)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: isClickable ? "pointer" : "default",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    userSelect: "none",
                  }}
                  className="dashboard-box"
                  aria-disabled={!isClickable}
                  title={title}
                >
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: isClickable ? "#2e86de" : "#6b7280",
                      textAlign: "center",
                      padding: "0 8px",
                      userSelect: "text",
                    }}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </section>
        </main>

        <style>
          {`
            .dashboard-box:hover {
              transform: scale(1.05);
              box-shadow: 0 14px 32px rgba(47,128,237,0.20);
              z-index: 2;
            }
            .dashboard-box:focus-visible {
              outline: 3px solid #2f80ed;
              outline-offset: 4px;
            }
          `}
        </style>
      </div>
    </>
  );
};

export default Dashboard;
