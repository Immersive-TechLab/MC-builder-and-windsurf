"use client";
import React from "react";
import styles from "./MarketConfidence.module.css";
import MarketHeader from "./MarketHeader";
import MarketChart from "./MarketChart";
import PortfolioSection from "./PortfolioSection";
import MarketEvents from "./MarketEvents";

const MarketConfidence = () => {
  return (
    <main className={styles.marketConfidence}>
      <div className={styles.container}>
        <div className={styles.content}>
          <MarketHeader />
          <section className={styles.mainContent}>
            <div className={styles.contentWrapper}>
              <MarketChart />
              <PortfolioSection />
              <MarketEvents />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MarketConfidence;
