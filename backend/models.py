from pydantic import BaseModel
import enum

# ------ some basic data types ------

class FundType(str, enum.Enum):
    INDEX = "Index"
    ETF = "ETF"
    MUTUAL_FUND = "Mutual Fund"
    STOCK = "Stock"

class Fund(BaseModel):
    name: str # name of the fund
    ticker: str # ticker of the fund
    fund_type: FundType # type of the fund
    
class GraphDataPoint(BaseModel):
    date: str # date of the data point
    value: float # value of the data point

class Holding(BaseModel):
    ticker: str # ticker of the holding
    purchase_value: float # value of the holding in USD

# ------ request and response models ------

# GET /funds

class SearchFundsRequest(BaseModel):
    query: str # search query

class SearchFundsResponse(BaseModel):
    funds: list[Fund] # list of fund names matching the search term
    total: int # total number of funds matching the search term

# GET /graph-data

class GraphDataRequest(BaseModel):
    holdings: list[Holding] # list of holdings to get data for
    start_date: str # start date of the data
    end_date: str # end date of the data

class GraphDataResponse(BaseModel):
    data: list[GraphDataPoint]
    
# GET /market-events

class MarketEventRequest(BaseModel):
    query: str # name of the market event

class MarketEventResponse(BaseModel):
    name: str # name of the market event
    start_date: str # start date of the market event
    end_date: str # end date of the market event
    description: str # description of the market event