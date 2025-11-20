import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Labourers Details", href: "/labourersDetails" },
  { label: "All Work Details", href: "/allWorkDetails" },
  { label: "Settings", href: "/settings" },
  { label: "Help & Contact", href: "/help" },
  { label: "Account", href: "/account" },
  { label: "Logout", href: "/" },
];

const styles = {
  headerContainer: {
    position: "relative",
    padding: "16px 32px",
    backgroundColor: "#1565c0",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    userSelect: "none",
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: "0.05em",
  },
  menuIcon: {
    fontSize: 28,
    cursor: "pointer",
    background: "none",
    border: "none",
    color: "white",
    padding: 8,
    borderRadius: 4,
    transition: "background-color 0.3s ease",
  },
  menuIconHover: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 32,
    background: "white",
    borderRadius: 10,
    boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
    padding: "8px 0",
    minWidth: 200,
    zIndex: 1000,
    fontSize: 16,
  },
  dropdownItem: {
    padding: "12px 24px",
    color: "#1565c0",
    textDecoration: "none",
    display: "block",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#e3f2fd",
  },
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  
  const toggleMenu = () => setMenuOpen((o) => !o);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!menuOpen) return;

    function handleOutsideClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeydown(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [menuOpen]);
  
  return (
    <header style={styles.headerContainer}>
      <h1 style={styles.title}>Labour Payment System</h1>

      <button
        ref={buttonRef}
        style={{
          ...styles.menuIcon,
          ...(menuOpen ? styles.menuIconHover : {}),
        }}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMenu();
          }
        }}
      >
        &#9776;
      </button>

      {menuOpen && (
        <nav
          ref={menuRef}
          style={styles.dropdown}
          role="menu"
          aria-label="Main menu"
        >
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              style={{
                ...styles.dropdownItem,
                ...(hoveredIdx === idx ? styles.dropdownItemHover : {}),
              }}
              role="menuitem"
              tabIndex={0}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMenuOpen(false);
                  window.location.href = item.href;
                }
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
