import React from "react";
import styles from "./MarketCard.module.css";

const MarketCard = ({ icon, title, date, description }) => {
  return (
    <article className={styles.marketCard}>
      <div className={styles.cardHeader}>
        <img src={icon} alt="" className={styles.eventIcon} />
        <h3 className={styles.eventTitle}>{title}</h3>
      </div>
      <time className={styles.eventDate}>{date}</time>
      <p className={styles.eventDescription}>{description}</p>
    </article>
  );
};

export default MarketCard;
