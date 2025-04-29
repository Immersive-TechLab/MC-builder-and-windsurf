"use client";
import React, { useState } from "react";
import styles from "./PortfolioSection.module.css";
import InvestmentItem from "./InvestmentItem";
import InvestmentModal from "./InvestmentModal";
import { usePortfolio } from "../context/PortfolioContext";

const PortfolioSection = () => {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get portfolio data and functions from context
  const { 
    portfolio, 
    totalInvestment, 
    addInvestment,
    removeInvestment, 
    resetPortfolio,
    updateInvestmentAmount
  } = usePortfolio();
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
          {/* Reset button removed as requested */}
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
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
        {portfolio.map((investment, index) => (
          <InvestmentItem
            key={index}
            name={investment.name}
            type={investment.type}
            amount={investment.amount.toString()}
            currency={investment.currency}
            deleteIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/afb4cb9a27b08da242ff71274c5f18e2f2b15db3?placeholderIfAbsent=true&apiKey=565aa3f054e94263bc85135737180db5"
            onDelete={() => removeInvestment(index)}
            onAmountChange={(newAmount) => updateInvestmentAmount(index, newAmount)}
          />
        ))}
      </div>

      <div className={styles.totalInvestment}>
        <h3 className={styles.totalLabel}>Total Investment</h3>
        <span className={styles.totalAmount}>${totalInvestment.toLocaleString()} {portfolio.length > 0 ? portfolio[0].currency : 'USD'}</span>
      </div>
      
      {/* Investment Modal */}
      <InvestmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectFund={addInvestment}
        existingFunds={portfolio}
      />
    </section>
  );
};

export default PortfolioSection;
