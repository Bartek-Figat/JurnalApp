import { useQuery } from "@tanstack/react-query";
import { MOCK_DATA } from "./mockData";

export const GET_TRADE_DATA_QUERY_KEY = ["trade", "data"];

export interface TradeDataResponse {
  _id: {
    $oid: string;
  };
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  risk: number;
  reward: number;
  tags: string[];
  tradeType: string;
  entryDate: {
    $date: string;
  };
  exitDate: {
    $date: string;
  };
  quantity: number;
  createdAt: {
    $date: string;
  };
  optionType: null;
  strikePrice: null;
  optionPremium: null;
  units: null;
  usdExchangeRate: null;
  leverage: null;
  positionType: null;
  riskPercentage: number;
  fees: number;
  userId: string;
  tradeOutcome: string;
}

export const useTradeData = () => {
  const query = useQuery<TradeDataResponse[]>({
    queryKey: GET_TRADE_DATA_QUERY_KEY,
    queryFn: async () => {
      return new Promise((resolve) =>
        setTimeout(
          () => resolve(MOCK_DATA as unknown as TradeDataResponse[]),
          0,
        ),
      );
    },
  });

  return query;
};
