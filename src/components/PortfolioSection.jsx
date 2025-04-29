"use client";
import React, { useState } from "react";
import styles from "./PortfolioSection.module.css";
import InvestmentItem from "./InvestmentItem";
import SearchModal from "./SearchModal";

// Create a global event to communicate between components
let selectedFundListener = null;

export const subscribeToFundSelection = (callback) => {
  selectedFundListener = callback;
  return () => {
    selectedFundListener = null;
  };
};

const PortfolioSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className={styles.portfolioSection}>
      <h2 className={styles.portfolioTitle}>My Portfolio</h2>

      <div className={styles.portfolioHeader}>
        <div className={styles.accountSelector}>
          <div className={styles.accountField}>
            <div className={styles.accountIcon}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a3287f6f2cb896e4662dd30f6ab939cee0550c58?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
                alt=""
                className={styles.icon}
              />
            </div>
            <div className={styles.accountContent}>
              <label className={styles.accountLabel}>Account</label>
              <span className={styles.accountValue}>RRSP</span>
            </div>
            <button className={styles.accountDropdown}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/de285ba024c54d77eba8f848d53114810ca2d2f3?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
                alt="Select account"
                className={styles.icon}
              />
            </button>
          </div>

          <button className={styles.exportButton}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dec59a1848d75b2c4f3a58d38a8d862bd7a4e300?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
              alt=""
              className={styles.buttonIcon}
            />
            <span>Export PDF</span>
          </button>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.resetButton}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fb1fa9a8658557c9b412de2223f3766993c5dde4?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
              alt=""
              className={styles.buttonIcon}
            />
            <span>Reset</span>
          </button>
          <button 
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/49cc28a2b5e38d4f7479912918bb980b8be11da6?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
              alt=""
              className={styles.buttonIcon}
            />
            <span>Add Investment</span>
          </button>
        </div>
      </div>

      <div className={styles.investmentsList}>
        <InvestmentItem
          name="S&P 500 ETF"
          type="ETF"
          amount="10000"
          currency="USD"
          deleteIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/afb4cb9a27b08da242ff71274c5f18e2f2b15db3?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
        />
        <InvestmentItem
          name="Tech Growth Fund"
          type="Fund"
          amount="5000"
          currency="CAD"
          deleteIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/2af59649f302b1438d5c931bcfa579987e473837?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
        />
        <InvestmentItem
          name="Bond Fund"
          type="Fund"
          amount="3000"
          currency="CAD"
          deleteIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/e18521df948e656f54cd98c5981176bac492a27e?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
        />
      </div>

      <div className={styles.totalInvestment}>
        <h3 className={styles.totalLabel}>Total Investment</h3>
        <span className={styles.totalAmount}>$18,000 CAD</span>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelectFund={(fund) => {
          // Notify subscribers when a fund is selected
          if (selectedFundListener) {
            selectedFundListener(fund);
          }
        }}
      />
    </section>
  );
};

export default PortfolioSection;
