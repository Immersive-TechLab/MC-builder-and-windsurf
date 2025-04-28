"use client";
import React from "react";
import styles from "./MarketChart.module.css";
import SegmentedButton from "./SegmentedButton";

const MarketChart = () => {
  return (
    <section className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <div className={styles.titleGroup}>
          <h2 className={styles.chartTitle}>S&P 500 Historical Performance</h2>
          <SegmentedButton
            options={[
              {
                label: "Equities",
                icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bdc7acf22a46e53572d18667c57c8dbc0883388e?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5",
                selected: true,
              },
              { label: "Bonds", selected: false },
              { label: "Mixed", selected: false },
            ]}
          />
        </div>
        <div className={styles.timeframeButtons}>
          <button className={styles.timeButton}>6M</button>
          <button className={`${styles.timeButton} ${styles.selected}`}>
            1Y
          </button>
          <button className={styles.timeButton}>5Y</button>
          <button className={styles.timeButton}>10Y</button>
        </div>
      </div>

      <div className={styles.chartContent}>
        <div className={styles.priceInfo}>
          <div className={styles.currentPrice}>$4,816</div>
          <div className={styles.priceChange}>
            <span className={styles.negative}>-2.34 (-0.05%)</span>
          </div>
          <div className={styles.chartControls}>
            <SegmentedButton
              options={[
                {
                  icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bdc7acf22a46e53572d18667c57c8dbc0883388e?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5",
                  selected: true,
                },
                {
                  icon: "https://cdn.builder.io/api/v1/image/assets%2F565aa3f054e94263bc85135737180db5%2F180dcd81b34e414388a35cbcfafd39fd",
                  selected: false,
                },
              ]}
              compact
            />
          </div>
        </div>

        <div className={styles.chartContainer}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cb8619107962f69afbae8fd1084453c8c10c7a91?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
            alt="Market Performance Chart"
            className={styles.chartImage}
          />
        </div>

        <div className={styles.sentimentIndicator}>
          <div className={styles.sentimentScale}>
            <span className={styles.sentimentLabel}>Fear</span>
            <div className={styles.slider}>
              <div className={styles.sliderTrack}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/93b166cff3d6780440ca24b5f40d6351b555bd39?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
                  alt=""
                  className={styles.leftTrack}
                />
                <div className={styles.sliderHandle} />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3647b34a1313759370402885aed9f054c7336714?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
                  alt=""
                  className={styles.rightTrack}
                />
              </div>
            </div>
            <span className={styles.sentimentLabel}>Greed</span>
          </div>
          <div className={styles.indicators}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F565aa3f054e94263bc85135737180db5%2F16900c1c7c9748eb847181037bb06ed8"
              alt=""
              className={styles.indicator}
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F565aa3f054e94263bc85135737180db5%2Fd9d8df68aa5b4d059437abbe5d2166bf"
              alt=""
              className={styles.indicator}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketChart;
