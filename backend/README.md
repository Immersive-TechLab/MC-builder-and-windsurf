# Market Comparison Builder API Documentation

This document provides a detailed overview of the Flask API endpoints available in the Market Comparison Builder application. The API allows users to search for financial instruments, retrieve historical data for portfolios, and find information about major market events.

## Table of Contents
- [Search Funds](#search-funds)
- [Graph Data](#graph-data)
- [Market Event](#market-event)

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

## Market Event

Generates a market event based on a query string using OpenAI.

**URL:** `/market-event`

**Method:** `GET`

**Query Parameters:**

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| query     | string | Yes      | The search term to generate a relevant market event |

### Sample Request

```
GET /market-event?query=dot+com+bubble
```

### Sample Response

```json
{
  "name": "Dot-Com Bubble",
  "start_date": "1995-03-11",
  "end_date": "2002-10-09",
  "description": "A period of excessive speculation in Internet-related companies that led to a rapid rise in the Nasdaq index from 1995 to 2000, followed by a crash. The bubble was characterized by a surge in equity valuations of internet and technology companies, many of which had little or no profit."
}
```

**Notes:**
- This endpoint uses OpenAI to generate historically accurate information about market events
- Requires an OpenAI API key to be set as an environment variable (`OPENAI_API_KEY`)
- Returns a single market event with name, start date, end date, and description

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