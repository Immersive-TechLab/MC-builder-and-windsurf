import React from "react";
import styles from "./MarketEvents.module.css";
import MarketCard from "./MarketCard";

const MarketEvents = () => {
  return (
    <section className={styles.eventsSection}>
      <div className={styles.eventsHeader}>
        <h2 className={styles.eventsTitle}>Popular Market Events</h2>
        <div className={styles.searchBar}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bae337066751a4c5381162c0a3701284a820484?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
            alt=""
            className={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="Search market events..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.eventsGrid}>
        <MarketCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/aadebd268b98a26923d13f32633ed33dc325714d?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
          title="COVID-19 Crash"
          date="March 2020"
          description="Market dropped 34% but recovered within 6 months, marking the shortest bear market in history."
        />
        <MarketCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d276de5288fb354b67ec28202b64a356b06464c8?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
          title="2008 Financial Crisis"
          date="September 2008"
          description="The S&P 500 fell 46.13% and took approximately 4 years to recover to previous levels."
        />
        <MarketCard
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/c90539a552d778d3a3b8be0b778c219051eadffd?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
          title="Dot-com Bubble"
          date="March 2000"
          description="Tech-heavy market collapse led to a 49.1% decline, taking 7 years to recover fully."
        />
      </div>
    </section>
  );
};

export default MarketEvents;
