import React from "react";

interface ProgressBarProps {
  percentage: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, label }) => {
  return (
    <div className="progress-bar-container" style={{ margin: "10px 0" }}>
      {label && <span className="progress-label">{label}</span>}

      <div
        className="progress-bar"
        style={{
          width: "100%",
          height: "25px",
          backgroundColor: "#e0e0e0",
          borderRadius: "5px",
          overflow: "hidden",
        }}
      >
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "#4caf50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            transition: "width 0.3s ease",
          }}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};
