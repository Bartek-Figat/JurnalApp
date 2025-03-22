import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import axios from "axios";

interface Trade {
  _id: string;
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

const TradeModal: React.FC<{
  trade: Trade;
  onClose: () => void;
  darkMode: boolean;
}> = ({ trade, onClose, darkMode }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTrade = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    console.log("Trade deleted");
    setIsDeleting(false);
    onClose();
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  const handleViewTradeDetails = () => {
    navigate(`/dashboard/trade/${trade._id}`);
    onClose();
  };

  const { profitLoss, gainPercentage } = calculateProfitLoss(
    trade.entryPrice,
    trade.exitPrice,
    trade.quantity,
    trade.fees,
  );

  const borderColorClassModal = profitLoss.startsWith("-")
    ? "border-l-theme-color-destructive"
    : "border-l-theme-color-success";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-[999] grid h-screen w-screen place-items-center ${
          darkMode ? "bg-black bg-opacity-80" : "bg-black bg-opacity-60"
        } backdrop-blur-sm`}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl ${
            darkMode
              ? "text-neutral-300 dark:bg-[#151822]"
              : "bg-white text-gray-700"
          } shadow-md`}
          role="document"
        >
          <div className="flex flex-col gap-4 p-6">
            <h2
              className={`h-12 w-2 border-l-2 p-2 text-3xl font-bold ${borderColorClassModal}`}
            >
              {trade.symbol}
            </h2>

            <p className="mt-4 text-lg">
              Entry Price: <span className="font-bold">{trade._id}</span>
            </p>

            <p className="mt-4 text-lg">
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
                ${profitLoss} ({gainPercentage}%)
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
          </div>

          {isDeleting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div
                className={`rounded-lg p-4 ${darkMode ? "bg-[#1a1c1e] text-neutral-300" : "bg-white text-gray-700"}`}
              >
                <p>Are you sure you want to delete this trade?</p>
                <button onClick={confirmDelete} className="text-red-500">
                  Yes, Delete
                </button>
                <button onClick={cancelDelete} className="text-gray-500">
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="p-6 pt-0">
            <button
              className="my-1 block w-full select-none rounded-lg bg-gradient-to-tr from-pink-600 to-pink-400 px-6 py-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-pink-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="my-1 block w-full select-none rounded-lg bg-blue-500 px-6 py-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50"
              type="button"
              onClick={handleViewTradeDetails} // Update this handler
            >
              View
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TradeModal;

export const BestTradesDisplay: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [bestTrades, setBestTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  useEffect(() => {
    // Fetch trades from the API
    const fetchTrades = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/trades/list",
          {
            params: { skip: 0, limit: 10 },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          },
        );
        const trades = response.data.map((trade: Trade) => {
          const { profitLoss, gainPercentage } = calculateProfitLoss(
            trade.entryPrice,
            trade.exitPrice,
            trade.quantity,
            trade.fees,
          );
          return { ...trade, profitLoss, gainPercentage };
        });
        setBestTrades(trades);
      } catch (error) {
        console.error("Failed to fetch trades:", error);
      }
    };

    fetchTrades();
  }, []);

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleCloseModal = () => {
    setSelectedTrade(null);
  };

  return (
    <div className="flex flex-col p-8 dark:bg-[#0C0F17] md:flex-row">
      <div
        className={`flex-1 rounded-md p-8 shadow-2xl ${
          isDarkMode
            ? "bg-[#151822] text-neutral-300"
            : "bg-white text-[#000080]"
        }`}
      >
        <h3
          className={`mb-6 text-xl font-bold ${
            isDarkMode ? "dark:text-neutral-300" : "text-[#000080]"
          }`}
        >
          Best Trades
        </h3>
        <ul className="space-y-4">
          {bestTrades.map((trade, index) => (
            <li
              key={index}
              className={`flex cursor-pointer items-center justify-between rounded-sm p-2 transition-all duration-300 ease-in-out ${
                isDarkMode
                  ? "hover:bg-[#1A99CE] dark:border-neutral-700 dark:hover:bg-[#2A2D3D]"
                  : "border-gray-200 hover:bg-[#f0f0f0]"
              } ${index < bestTrades.length - 1 ? "border-b" : ""}`}
              onClick={() => handleTradeClick(trade)}
            >
              <div>
                <span
                  className={`block text-lg font-bold ${
                    isDarkMode ? "dark:text-neutral-300" : "text-[#000080]"
                  }`}
                >
                  <span
                    className={`${trade.profitLoss.startsWith("-") ? "bg-red" : "bg-green"}`}
                  >
                    {trade.symbol}
                  </span>
                </span>
                <span
                  className={`text-sm ${
                    isDarkMode ? "dark:text-neutral-400" : "text-[#000080]"
                  }`}
                >
                  Entry Price:{" "}
                  <span className={`highlight`}>
                    ${trade.entryPrice.toFixed(2)}
                  </span>{" "}
                  | Exit Price:{" "}
                  <span className={`highlight`}>
                    ${trade.exitPrice.toFixed(2)}
                  </span>
                </span>
              </div>
              <span
                className={`highlight font-bold ${
                  isDarkMode
                    ? "highlight-dark dark:text-neutral-300"
                    : "highlight-light text-[#000080]"
                }`}
              >
                Profit/Loss: ${trade.profitLoss} ({trade.gainPercentage}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
      {selectedTrade && (
        <TradeModal
          trade={selectedTrade}
          onClose={handleCloseModal}
          darkMode={isDarkMode}
        />
      )}{" "}
      {/* Modal */}
    </div>
  );
};
