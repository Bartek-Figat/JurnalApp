import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../../contexts/DarkModeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Trade {
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  profitLoss: string;
  gainPercentage: string;
  risk: number;
  reward: number;
  tags: string[];
  tradeType: string;
  entryDate: string;
  exitDate: string;
  quantity: number;
  createdAt: string;
  optionType: string | null;
  strikePrice: string | null;
  optionPremium: string | null;
  units: string | null;
  usdExchangeRate: string | null;
  leverage: string | null;
  positionType: string | null;
  riskPercentage: number;
  fees: number;
  userId: string;
  tradeOutcome: string;
}

const calculateProfitLoss = (
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  fees: number,
) => {
  const profitLoss = (exitPrice - entryPrice) * quantity - fees;
  const gainPercentage = ((profitLoss / (entryPrice * quantity)) * 100).toFixed(
    2,
  );
  return { profitLoss: profitLoss.toFixed(2), gainPercentage };
};

const TradeDetail: React.FC = () => {
  const { tradeId } = useParams<{ tradeId: string }>();
  const { isDarkMode } = useDarkMode();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [profitLossData, setProfitLossData] = useState<{
    profitLoss: string;
    gainPercentage: string;
  } | null>(null);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/trades/get/${tradeId}`,
        );
        console.log(response);
        setTrade(response.data);

        const { entryPrice, exitPrice, quantity, fees } = response.data;
        const profitLossResult = calculateProfitLoss(
          entryPrice,
          exitPrice,
          quantity,
          fees,
        );
        setProfitLossData(profitLossResult);
      } catch (error) {
        console.error("Failed to fetch trade details:", error);
      }
    };

    fetchTrade();
  }, [tradeId]);

  if (!trade || !profitLossData) {
    return <div>Loading...</div>;
  }

  const { gainPercentage } = profitLossData;
  const gainPercentageNumber = parseFloat(gainPercentage);

  // Format the data for the line chart
  const chartData = [
    {
      name: "Entry",
      price: trade.entryPrice,
      date: new Date(trade.entryDate).toLocaleDateString(),
    },
    {
      name: "Exit",
      price: trade.exitPrice,
      date: new Date(trade.exitDate).toLocaleDateString(),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-20 dark:bg-[#0C0F17]">
      <div
        className={`w-full p-8 ${
          isDarkMode ? "text-neutral-300" : "bg-white text-[#000080]"
        } transform rounded-lg shadow-lg`}
      >
        <h2 className="mb-6 text-4xl font-extrabold tracking-tight">
          {trade.symbol}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <p className="text-lg">
            Entry Price:{" "}
            <span className="font-bold">${trade.entryPrice.toFixed(2)}</span>
          </p>
          <p className="text-lg">
            Exit Price:{" "}
            <span className="font-bold">${trade.exitPrice.toFixed(2)}</span>
          </p>
          <p className="text-lg">
            Profit/Loss:{" "}
            <span className="font-bold">
              ${trade.profitLoss} ({trade.gainPercentage}%)
            </span>
          </p>
          <p className="text-lg">
            Risk: <span className="font-bold">${trade.risk.toFixed(2)}</span>
          </p>
          <p className="text-lg">
            Reward:{" "}
            <span className="font-bold">${trade.reward.toFixed(2)}</span>
          </p>
          <p className="text-lg">
            Trade Type: <span className="font-bold">{trade.tradeType}</span>
          </p>
          <p className="text-lg">
            Entry Date:{" "}
            <span className="font-bold">
              {new Date(trade.entryDate).toLocaleDateString()}
            </span>
          </p>
          <p className="text-lg">
            Exit Date:{" "}
            <span className="font-bold">
              {new Date(trade.exitDate).toLocaleDateString()}
            </span>
          </p>
          <p className="text-lg">
            Quantity: <span className="font-bold">{trade.quantity}</span>
          </p>
          <p className="text-lg">
            Risk Percentage:{" "}
            <span className="font-bold">{trade.riskPercentage}%</span>
          </p>
          <p className="text-lg">
            Fees: <span className="font-bold">${trade.fees.toFixed(2)}</span>
          </p>
          <p className="text-lg">
            Created At:{" "}
            <span className="font-bold">
              {new Date(trade.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="text-lg">
            Option Type:{" "}
            <span className="font-bold">{trade.optionType || "N/A"}</span>
          </p>
          <p className="text-lg">
            Strike Price:{" "}
            <span className="font-bold">{trade.strikePrice || "N/A"}</span>
          </p>
          <p className="text-lg">
            Option Premium:{" "}
            <span className="font-bold">{trade.optionPremium || "N/A"}</span>
          </p>
          <p className="text-lg">
            Units: <span className="font-bold">{trade.units || "N/A"}</span>
          </p>
          <p className="text-lg">
            USD Exchange Rate:{" "}
            <span className="font-bold">{trade.usdExchangeRate || "N/A"}</span>
          </p>
          <p className="text-lg">
            Leverage:{" "}
            <span className="font-bold">{trade.leverage || "N/A"}</span>
          </p>
          <p className="text-lg">
            Position Type:{" "}
            <span className="font-bold">{trade.positionType || "N/A"}</span>
          </p>
          <p className="text-lg">
            User ID: <span className="font-bold">{trade.userId || "N/A"}</span>
          </p>
          <p className="text-lg">
            Trade Outcome:{" "}
            <span className="font-bold">{trade.tradeOutcome || "N/A"}</span>
          </p>
          <p className="col-span-2 text-lg">
            Tags: <span className="font-bold">{trade.tags.join(", ")}</span>
          </p>
          <div className="col-span-2 mt-4">
            <label className="mb-2 block text-lg font-bold">
              Gain Percentage:
            </label>
            <div className="h-6 w-full rounded-full bg-gray-200">
              <div
                className={`h-6 rounded-full ${
                  gainPercentageNumber >= 0 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${Math.abs(gainPercentageNumber)}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center text-lg font-bold">
              {gainPercentageNumber}%
            </p>
          </div>
          <div className="col-span-2 mt-8">
            <h3 className="mb-4 text-lg font-bold">Price Movement</h3>
            <div className="transform overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: isDarkMode ? "#ffffff" : "#000000" }}
                  />
                  <YAxis tick={{ fill: isDarkMode ? "#ffffff" : "#000000" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#333333" : "#ffffff",
                      borderColor: isDarkMode ? "#444444" : "#cccccc",
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetail;
