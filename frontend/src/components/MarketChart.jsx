"use client";
import React, { useEffect, useState } from "react";
import styles from "./MarketChart.module.css";
import SegmentedButton from "./SegmentedButton";
import { useMarketEvent } from "../context/MarketEventContext";
import { usePortfolio } from "../context/PortfolioContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Function to get different colors for chart lines
const getLineColor = (index) => {
  const colors = ['#3182CE', '#38A169', '#E53E3E', '#DD6B20', '#805AD5', '#D69E2E', '#319795'];
  return colors[index % colors.length];
};

const MarketChart = () => {
  const { selectedEvent } = useMarketEvent();
  const { portfolio, graphData, isLoadingGraph, setTimeFrame } = usePortfolio();
  const [chartTitle, setChartTitle] = useState("Portfolio Historical Performance");
  const [activeTimeframe, setActiveTimeframe] = useState('1Y'); // Default active timeframe

  // Update chart when selected event or portfolio changes
  useEffect(() => {
    if (selectedEvent) {
      setChartTitle(`Portfolio: ${selectedEvent.name} Impact`);
      console.log("Updating chart with event:", selectedEvent);
      // The PortfolioContext already handles updating the graph data
    } else {
      // Generate title based on portfolio holdings
      const holdings = portfolio.map(item => item.name);
      if (holdings.length === 1) {
        setChartTitle(`${holdings[0]} Historical Performance`);
      } else if (holdings.length > 1) {
        setChartTitle(`Portfolio (${holdings.length} holdings) Performance`);
      } else {
        setChartTitle("Portfolio Historical Performance");
      }
    }
  }, [selectedEvent, portfolio]);
  return (
    <section className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <div className={styles.titleGroup}>
          <h2 className={styles.chartTitle}>{chartTitle}</h2>
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
          <button 
            className={`${styles.timeButton} ${activeTimeframe === '6M' ? styles.selected : ''}`}
            onClick={() => {
              setTimeFrame('6M');
              setActiveTimeframe('6M');
            }}
          >
            6M
          </button>
          <button 
            className={`${styles.timeButton} ${activeTimeframe === '1Y' ? styles.selected : ''}`}
            onClick={() => {
              setTimeFrame('1Y');
              setActiveTimeframe('1Y');
            }}
          >
            1Y
          </button>
          <button 
            className={`${styles.timeButton} ${activeTimeframe === '5Y' ? styles.selected : ''}`}
            onClick={() => {
              setTimeFrame('5Y');
              setActiveTimeframe('5Y');
            }}
          >
            5Y
          </button>
          <button 
            className={`${styles.timeButton} ${activeTimeframe === '10Y' ? styles.selected : ''}`}
            onClick={() => {
              setTimeFrame('10Y');
              setActiveTimeframe('10Y');
            }}
          >
            10Y
          </button>
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
          {isLoadingGraph ? (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner}></div>
              <p>Loading chart data...</p>
            </div>
          ) : graphData && graphData.data && graphData.data.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={graphData.data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      // Adjust date format based on timeframe
                      switch(activeTimeframe) {
                        case '6M':
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        case '1Y':
                          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                        case '5Y':
                        case '10Y':
                          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        default:
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }
                    }}
                    // Adjust the number of ticks based on timeframe
                    interval={activeTimeframe === '6M' ? 5 : activeTimeframe === '1Y' ? 15 : 30}
                  />
                  <YAxis 
                    label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, 'Value']}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="portfolioValue" 
                    stroke="#3182CE" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    name="Portfolio Value"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className={styles.portfolioInfo}>
                <div className={styles.portfolioHoldings}>
                  {portfolio.map(item => item.ticker).join(', ')}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noDataMessage}>
              No chart data available. Please select different holdings or time frame.
            </div>
          )}
        </div>

        {/* Sentiment indicator removed as requested */}
      </div>
    </section>
  );
};

export default MarketChart;
