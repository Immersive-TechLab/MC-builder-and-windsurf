"use client";
import React, { useState } from "react";
import styles from "./MarketChart.module.css";
import SegmentedButton from "./SegmentedButton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const MarketChart = () => {
  // Use sample datapoints for S&P 500 performance
  const [timeframe, setTimeframe] = useState("1Y");
  
  // Sample data for different timeframes
  const getChartData = () => {
    // Sample data points for different timeframes
    const data6M = [
      { date: "Nov, 2024", value: 4783.35 },
      { date: "Dec, 2024", value: 4900.12 },
      { date: "Jan, 2025", value: 4867.24 },
      { date: "Feb, 2025", value: 4951.38 },
      { date: "Mar, 2025", value: 4876.19 },
      { date: "Apr, 2025", value: 4912.70 },
      { date: "May, 2025", value: 4928.53 }
    ];
    
    const data1Y = [
      { date: "May, 2024", value: 4612.82 },
      { date: "Jun, 2024", value: 4695.40 },
      { date: "Jul, 2024", value: 4729.83 },
      { date: "Aug, 2024", value: 4673.19 },
      { date: "Sep, 2024", value: 4718.50 },
      { date: "Oct, 2024", value: 4758.32 },
      { date: "Nov, 2024", value: 4783.35 },
      { date: "Dec, 2024", value: 4900.12 },
      { date: "Jan, 2025", value: 4867.24 },
      { date: "Feb, 2025", value: 4951.38 },
      { date: "Mar, 2025", value: 4876.19 },
      { date: "Apr, 2025", value: 4912.70 },
      { date: "May, 2025", value: 4928.53 }
    ];
    
    const data5Y = [
      { date: "May, 2020", value: 2830.71 },
      { date: "Nov, 2020", value: 3269.96 },
      { date: "May, 2021", value: 3709.71 },
      { date: "Nov, 2021", value: 4080.11 },
      { date: "May, 2022", value: 3839.50 },
      { date: "Nov, 2022", value: 3856.10 },
      { date: "May, 2023", value: 4179.83 },
      { date: "Nov, 2023", value: 4378.41 },
      { date: "May, 2024", value: 4612.82 },
      { date: "Nov, 2024", value: 4783.35 },
      { date: "May, 2025", value: 4928.53 }
    ];
    
    const data10Y = [
      { date: "2015", value: 2043.94 },
      { date: "2016", value: 2238.83 },
      { date: "2017", value: 2673.61 },
      { date: "2018", value: 2506.85 },
      { date: "2019", value: 3230.78 },
      { date: "2020", value: 3756.07 },
      { date: "2021", value: 4766.18 },
      { date: "2022", value: 3839.50 },
      { date: "2023", value: 4179.83 },
      { date: "2024", value: 4783.35 },
      { date: "2025", value: 4928.53 }
    ];
    
    switch(timeframe) {
      case "6M": return data6M;
      case "5Y": return data5Y;
      case "10Y": return data10Y;
      case "1Y":
      default: return data1Y;
    }
  };
  
  const chartData = getChartData();
  const latestValue = chartData[chartData.length - 1].value.toFixed(0);
  const previousValue = chartData[chartData.length - 2].value.toFixed(0);
  const difference = (latestValue - previousValue).toFixed(2);
  const percentChange = (difference / previousValue * 100).toFixed(2);
  const isNegative = difference < 0;
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
          <button 
            className={`${styles.timeButton} ${timeframe === "6M" ? styles.selected : ""}`}
            onClick={() => setTimeframe("6M")}
          >
            6M
          </button>
          <button 
            className={`${styles.timeButton} ${timeframe === "1Y" ? styles.selected : ""}`}
            onClick={() => setTimeframe("1Y")}
          >
            1Y
          </button>
          <button 
            className={`${styles.timeButton} ${timeframe === "5Y" ? styles.selected : ""}`}
            onClick={() => setTimeframe("5Y")}
          >
            5Y
          </button>
          <button 
            className={`${styles.timeButton} ${timeframe === "10Y" ? styles.selected : ""}`}
            onClick={() => setTimeframe("10Y")}
          >
            10Y
          </button>
        </div>
      </div>

      <div className={styles.chartContent}>
        <div className={styles.priceInfo}>
          <div className={styles.currentPrice}>${Number(latestValue).toLocaleString()}</div>
          <div className={styles.priceChange}>
            <span className={isNegative ? styles.negative : styles.positive}>
              {isNegative ? "" : "+"}{difference} ({isNegative ? "" : "+"}{percentChange}%)
            </span>
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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#555' }} 
                tickLine={false}
                axisLine={{ stroke: '#eee' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 12, fill: '#555' }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'S&P 500']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #eee' }}
              />
              <ReferenceLine y={chartData[0].value} stroke="#ccc" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2451B7" 
                strokeWidth={2}
                dot={false} 
                activeDot={{ r: 6, fill: '#2451B7' }} 
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
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
