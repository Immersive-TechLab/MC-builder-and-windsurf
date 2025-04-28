import React from "react";
import styles from "./MarketHeader.module.css";

const MarketHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.titleWrapper}>
          <div className={styles.logoContainer}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/09a81d763b95ebfdd41841ffcc98a31a54086ac3?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
              alt="Market Insight Pro Logo"
              className={styles.logo}
            />
          </div>
          <h1 className={styles.title}>Market Insight Pro</h1>
        </div>
      </div>
    </header>
  );
};

export default MarketHeader;
