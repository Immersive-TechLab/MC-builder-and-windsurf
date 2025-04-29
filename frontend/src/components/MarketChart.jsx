"use client";
import React, { useState, useEffect } from "react";
import styles from "./MarketChart.module.css";
import SegmentedButton from "./SegmentedButton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Mock funds data
const mockFunds = [
  {
    id: "sp500",
    name: "S&P 500 Index",
    ticker: "SPX",
    type: "Index",
    description: "Large-cap U.S. equities"
  },
  {
    id: "qqq",
    name: "Invesco QQQ Trust",
    ticker: "QQQ",
    type: "ETF",
    description: "Tech-heavy Nasdaq 100 index"
  },
  {
    id: "dji",
    name: "Dow Jones Industrial Average",
    ticker: "DJI",
    type: "Index",
    description: "30 prominent companies listed on U.S. exchanges"
  }
];

const MarketChart = () => {
  // States for search, fund selection, and timeframe
  const [timeframe, setTimeframe] = useState("1Y");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFund, setSelectedFund] = useState(mockFunds[0]);
  const [showResults, setShowResults] = useState(false);
  
  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const filtered = mockFunds.filter(fund => 
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      fund.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowResults(true);
  }, [searchQuery]);
  
  // Handle fund selection
  const handleFundSelect = (fund) => {
    setSelectedFund(fund);
    setSearchQuery("");
    setShowResults(false);
  };
  
  // Sample data for different timeframes and funds
  const getChartData = () => {
    // Fund-specific data for different timeframes
    const fundData = {
      sp500: {
        data6M: [
          { date: "Nov, 2024", value: 4783.35 },
          { date: "Dec, 2024", value: 4900.12 },
          { date: "Jan, 2025", value: 4867.24 },
          { date: "Feb, 2025", value: 4951.38 },
          { date: "Mar, 2025", value: 4876.19 },
          { date: "Apr, 2025", value: 4912.70 },
          { date: "May, 2025", value: 4928.53 }
        ],
        data1Y: [
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
        ],
        data5Y: [
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
        ],
        data10Y: [
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
        ]
      },
      qqq: {
        data6M: [
          { date: "Nov, 2024", value: 383.12 },
          { date: "Dec, 2024", value: 402.85 },
          { date: "Jan, 2025", value: 418.64 },
          { date: "Feb, 2025", value: 425.17 },
          { date: "Mar, 2025", value: 413.89 },
          { date: "Apr, 2025", value: 431.24 },
          { date: "May, 2025", value: 442.78 }
        ],
        data1Y: [
          { date: "May, 2024", value: 370.45 },
          { date: "Jun, 2024", value: 375.82 },
          { date: "Jul, 2024", value: 382.17 },
          { date: "Aug, 2024", value: 376.55 },
          { date: "Sep, 2024", value: 381.92 },
          { date: "Oct, 2024", value: 378.43 },
          { date: "Nov, 2024", value: 383.12 },
          { date: "Dec, 2024", value: 402.85 },
          { date: "Jan, 2025", value: 418.64 },
          { date: "Feb, 2025", value: 425.17 },
          { date: "Mar, 2025", value: 413.89 },
          { date: "Apr, 2025", value: 431.24 },
          { date: "May, 2025", value: 442.78 }
        ],
        data5Y: [
          { date: "May, 2020", value: 234.85 },
          { date: "Nov, 2020", value: 289.42 },
          { date: "May, 2021", value: 325.64 },
          { date: "Nov, 2021", value: 361.20 },
          { date: "May, 2022", value: 311.76 },
          { date: "Nov, 2022", value: 292.18 },
          { date: "May, 2023", value: 341.43 },
          { date: "Nov, 2023", value: 368.97 },
          { date: "May, 2024", value: 370.45 },
          { date: "Nov, 2024", value: 383.12 },
          { date: "May, 2025", value: 442.78 }
        ],
        data10Y: [
          { date: "2015", value: 114.28 },
          { date: "2016", value: 123.67 },
          { date: "2017", value: 158.94 },
          { date: "2018", value: 154.26 },
          { date: "2019", value: 213.85 },
          { date: "2020", value: 289.42 },
          { date: "2021", value: 398.01 },
          { date: "2022", value: 311.76 },
          { date: "2023", value: 341.43 },
          { date: "2024", value: 383.12 },
          { date: "2025", value: 442.78 }
        ]
      },
      dji: {
        data6M: [
          { date: "Nov, 2024", value: 38124.78 },
          { date: "Dec, 2024", value: 39215.64 },
          { date: "Jan, 2025", value: 38957.32 },
          { date: "Feb, 2025", value: 39648.12 },
          { date: "Mar, 2025", value: 38912.57 },
          { date: "Apr, 2025", value: 39375.84 },
          { date: "May, 2025", value: 39814.23 }
        ],
        data1Y: [
          { date: "May, 2024", value: 36824.53 },
          { date: "Jun, 2024", value: 37128.94 },
          { date: "Jul, 2024", value: 37356.82 },
          { date: "Aug, 2024", value: 36984.71 },
          { date: "Sep, 2024", value: 37246.19 },
          { date: "Oct, 2024", value: 37785.43 },
          { date: "Nov, 2024", value: 38124.78 },
          { date: "Dec, 2024", value: 39215.64 },
          { date: "Jan, 2025", value: 38957.32 },
          { date: "Feb, 2025", value: 39648.12 },
          { date: "Mar, 2025", value: 38912.57 },
          { date: "Apr, 2025", value: 39375.84 },
          { date: "May, 2025", value: 39814.23 }
        ],
        data5Y: [
          { date: "May, 2020", value: 25383.11 },
          { date: "Nov, 2020", value: 29638.64 },
          { date: "May, 2021", value: 33576.39 },
          { date: "Nov, 2021", value: 35819.56 },
          { date: "May, 2022", value: 32990.12 },
          { date: "Nov, 2022", value: 32732.28 },
          { date: "May, 2023", value: 34589.76 },
          { date: "Nov, 2023", value: 35390.15 },
          { date: "May, 2024", value: 36824.53 },
          { date: "Nov, 2024", value: 38124.78 },
          { date: "May, 2025", value: 39814.23 }
        ],
        data10Y: [
          { date: "2015", value: 17719.92 },
          { date: "2016", value: 19762.60 },
          { date: "2017", value: 24719.22 },
          { date: "2018", value: 23327.46 },
          { date: "2019", value: 28538.44 },
          { date: "2020", value: 29638.64 },
          { date: "2021", value: 36338.30 },
          { date: "2022", value: 32990.12 },
          { date: "2023", value: 34589.76 },
          { date: "2024", value: 38124.78 },
          { date: "2025", value: 39814.23 }
        ]
      }
    };
    
    // Return the data based on selected fund and timeframe
    const fundId = selectedFund.id;
    
    switch(timeframe) {
      case "6M": return fundData[fundId].data6M;
      case "5Y": return fundData[fundId].data5Y;
      case "10Y": return fundData[fundId].data10Y;
      case "1Y":
      default: return fundData[fundId].data1Y;
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
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search market funds..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {showResults && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map(fund => (
              <div 
                key={fund.id} 
                className={styles.searchResultItem}
                onClick={() => handleFundSelect(fund)}
              >
                <div className={styles.fundTicker}>{fund.ticker}</div>
                <div className={styles.fundName}>{fund.name}</div>
                <div className={styles.fundType}>{fund.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.chartHeader}>
        <div className={styles.titleGroup}>
          <h2 className={styles.chartTitle}>{selectedFund.name} Historical Performance</h2>
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
