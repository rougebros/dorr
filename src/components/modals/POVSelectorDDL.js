import React, { useState, useEffect, useRef } from "react";
import "./POVSelectorDDL.css";

const POVSelectorDDL = ({ selectedPOV: initialPOV, onPOVChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPOV, setSelectedPOV] = useState(initialPOV || "self");
  const dropdownRef = useRef(null);

  const povOptions = [
    { value: "self", icon: "👁️" },
    { value: "peers", icon: "🫂" },
    { value: "public", icon: "🌍" },
  ];

  // Handle option click
  const handleOptionClick = (value) => {
    setSelectedPOV(value);
    setDropdownOpen(false); // Close dropdown
    if (onPOVChange) {
      onPOVChange(value); // Notify parent component of the selection
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false); // Close dropdown
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="pov-selector-ddl" ref={dropdownRef}>
      <div
        className="pov-selector-selected"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span>{povOptions.find((opt) => opt.value === selectedPOV)?.icon}</span>
      </div>
      {dropdownOpen && (
        <div className="pov-selector-options">
          {povOptions.map((option) => (
            <div
              key={option.value}
              className={`pov-selector-option ${
                selectedPOV === option.value ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default POVSelectorDDL;
