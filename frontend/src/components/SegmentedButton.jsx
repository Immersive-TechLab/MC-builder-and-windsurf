import React from "react";
import styles from "./SegmentedButton.module.css";

const SegmentedButton = ({ options, compact = false }) => {
  return (
    <div
      className={`${styles.segmentedButton} ${compact ? styles.compact : ""}`}
    >
      {options.map((option, index) => (
        <button
          key={index}
          className={`${styles.segment}
            ${index === 0 ? styles.start : ""}
            ${index === options.length - 1 ? styles.end : ""}
            ${option.selected ? styles.selected : ""}`}
        >
          {option.icon && (
            <img src={option.icon} alt="" className={styles.icon} />
          )}
          {option.label && <span className={styles.label}>{option.label}</span>}
        </button>
      ))}
    </div>
  );
};

export default SegmentedButton;
