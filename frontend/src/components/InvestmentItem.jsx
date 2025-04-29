import React from "react";
import styles from "./InvestmentItem.module.css";

const InvestmentItem = ({ name, type, amount, currency, deleteIcon, onDelete }) => {
  return (
    <div className={styles.investmentItem}>
      <div className={styles.investmentInfo}>
        <h4 className={styles.investmentName}>{name}</h4>
        <span className={styles.investmentType}>{type}</span>
      </div>
      <div className={styles.investmentAmount}>
        <div className={styles.amountGroup}>
          <input type="text" value={amount} className={styles.amountInput} />
          <span className={styles.currency}>{currency}</span>
        </div>
        <button className={styles.deleteButton} onClick={onDelete}>
          <img
            src={deleteIcon}
            alt="Delete investment"
            className={styles.deleteIcon}
          />
        </button>
      </div>
    </div>
  );
};

export default InvestmentItem;
