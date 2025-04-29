import React from 'react'
import './App.css'
import { MarketEventProvider } from './context/MarketEventContext'
import { PortfolioProvider } from './context/PortfolioContext'
import MarketConfidence from './components/MarketConfidence'

function App() {
  return (
    <MarketEventProvider>
      <PortfolioProvider>
        <div className="app">
          <MarketConfidence />
        </div>
      </PortfolioProvider>
    </MarketEventProvider>
  )
}

export default App
