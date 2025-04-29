# Market Comparison Builder API Documentation

This document provides a detailed overview of the Flask API endpoints available in the Market Comparison Builder application. The API allows users to search for financial instruments, retrieve historical data for portfolios, and find information about major market events.

## Table of Contents
- [Search Funds](#search-funds)
- [Graph Data](#graph-data)
- [Market Events](#market-events)

## Base URL

All endpoints are relative to the base URL: `http://localhost:5000`

---

## Search Funds

Searches for stocks, ETFs, and mutual funds based on a query string using Yahoo Finance.

**URL:** `/funds`

**Method:** `GET`

**Query Parameters:**

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| query     | string | Yes      | The search term to use for finding funds |

### Sample Request

```
GET /funds?query=apple
```

### Sample Response

```json
{
  "funds": [
    {
      "name": "Apple Inc.",
      "ticker": "AAPL",
      "fund_type": "Stock"
    },
    {
      "name": "Apple Hospitality REIT, Inc.",
      "ticker": "APLE",
      "fund_type": "Stock"
    },
    {
      "name": "iShares MSCI All Country Asia Information Technology ETF",
      "ticker": "AAIT",
      "fund_type": "ETF"
    }
  ],
  "total": 3
}
```

---

## Graph Data

Gets historical price data for a portfolio of holdings and calculates the value over time based on initial investment amounts.

**URL:** `/graph-data`

**Method:** `POST`

**Request Body:**

| Parameter  | Type           | Required | Description                                             |
|------------|----------------|---------|---------------------------------------------------------|
| holdings   | Holding[]      | Yes      | List of holdings with ticker and purchase value         |
| start_date | string         | Yes      | Start date in YYYY-MM-DD format                         |
| end_date   | string         | Yes      | End date in YYYY-MM-DD format                          |

**Holding Object:**

| Field         | Type     | Description                                       |
|---------------|----------|---------------------------------------------------|
| ticker        | string   | Ticker symbol of the stock/ETF/fund               |
| purchase_value| number   | Initial investment amount in USD                  |

### Sample Request

```
POST /graph-data
Content-Type: application/json

{
  "holdings": [
    {"ticker": "AAPL", "purchase_value": 10000},
    {"ticker": "MSFT", "purchase_value": 5000},
    {"ticker": "GOOGL", "purchase_value": 7500}
  ],
  "start_date": "2020-01-01",
  "end_date": "2022-12-31"
}
```

### Sample Response

```json
{
  "data": [
    {
      "date": "2020-01-02",
      "value": 22510.45
    },
    {
      "date": "2020-01-03",
      "value": 22317.89
    },
    {
      "date": "2020-01-06",
      "value": 22584.32
    },
    ...
  ]
}
```

**Notes:**
- Returns daily data for the specified date range only
- The calculation assumes that the specified purchase_value was invested on the first day of the date range
- Investment is converted to a number of shares based on the first day's price
- Values are adjusted for splits and dividends

---

## Market Events

Searches for historical market events based on a query string.

**URL:** `/market-events`

**Method:** `GET`

**Query Parameters:**

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| query     | string | No       | Search term to find relevant market events. If empty, returns the first 5 events. |

### Sample Request

```
GET /market-events?query=financial+crisis
```

### Sample Response

```json
{
  "events": [
    {
      "name": "Global Financial Crisis",
      "start_date": "2007-08-09",
      "end_date": "2009-03-06",
      "description": "A severe global economic crisis considered by many economists to have been the most serious financial crisis since the Great Depression. Triggered by the U.S. subprime mortgage crisis."
    },
    {
      "name": "European Debt Crisis",
      "start_date": "2009-10-01",
      "end_date": "2014-12-31",
      "description": "The period when several European countries faced the collapse of financial institutions, high government debt, and rapidly rising bond yield spreads in government securities."
    },
    {
      "name": "Asian Financial Crisis",
      "start_date": "1997-07-02",
      "end_date": "1998-12-31",
      "description": "A period of financial crisis that gripped much of East Asia and Southeast Asia beginning in July 1997, raising fears of a worldwide economic meltdown due to financial contagion."
    },
    {
      "name": "Russian Financial Crisis",
      "start_date": "1998-08-17",
      "end_date": "1998-09-30",
      "description": "A severe economic crisis in Russia that resulted in the Russian government defaulting on its debt. The ruble collapsed, inflation surged, and foreign investment fled the country."
    },
    {
      "name": "Savings and Loan Crisis",
      "start_date": "1986-01-01",
      "end_date": "1995-12-31",
      "description": "A financial crisis that led to the failure of 1,043 out of the 3,234 savings and loan associations in the United States. Cost American taxpayers approximately $124 billion."
    }
  ],
  "total": 5
}
```

**Notes:**
- The search uses string similarity matching for event names (70% weight) and checks if the query appears in descriptions (30% weight)
- Returns the top 5 most relevant events
- The database contains approximately 50 major market events from financial history

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid input data (e.g., validation error)
- `500 Internal Server Error`: Server-side issue

Error responses include a descriptive message:

```json
{
  "error": "Error description"
}
```

## Dependencies

- Flask
- Flask-CORS
- yfinance
- pandas
- pydantic

## Running the API

```bash
cd /path/to/backend
uv run routes.py
```

This will start the Flask server on `http://localhost:5000`.