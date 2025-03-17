import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDarkMode } from "../../../contexts/DarkModeContext";

// Define the type for a trade
interface Trade {
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  profitLoss: string;
  gainPercentage: string;
}

// Define the props for the component
interface BestTradesDisplayProps {
  bestTrades: Trade[];
}

const TradeModal: React.FC<{
  trade: Trade;
  onClose: () => void;
  darkMode: boolean;
}> = ({ trade, onClose, darkMode }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-10 flex max-h-[100vh] w-full items-center justify-center ${
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
          className={`relative mx-auto flex min-h-[40vh] w-full max-w-[24rem] flex-col items-center justify-center rounded-2xl ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
          } transform shadow-lg transition-transform hover:scale-105`}
          role="document"
        >
          <div className="flex max-h-full flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold">{trade.symbol}</h2>
              <p className="text-sm">
                Entry Price:{" "}
                <span className="font-bold">
                  ${trade.entryPrice.toFixed(2)}
                </span>
              </p>
              <p className="text-sm">
                Exit Price:{" "}
                <span className="font-bold">${trade.exitPrice.toFixed(2)}</span>
              </p>
              <p className="text-sm">
                Profit/Loss:{" "}
                <span className="font-bold">
                  ${trade.profitLoss} ({trade.gainPercentage}%)
                </span>
              </p>
            </div>

            <div className="flex items-end">
              <button
                onClick={onClose}
                className="my-6 select-none rounded-lg bg-blue-600 px-6 py-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-lg transition-all hover:bg-blue-700 active:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                type="button"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// path/to/your/component
export const BestTradesDisplay: React.FC<BestTradesDisplayProps> = ({
  bestTrades,
}) => {
  const { isDarkMode } = useDarkMode();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleCloseModal = () => {
    setSelectedTrade(null);
  };

  return (
    <div className="flex flex-col p-6 dark:bg-[#0C0F17] md:flex-row">
      <div
        className={`flex-1 rounded-md p-8 shadow-lg ${isDarkMode ? "bg-[#151822] text-neutral-300" : "bg-white text-[#000080]"}`}
      >
        <h3
          className={`mb-4 text-lg font-semibold ${isDarkMode ? "dark:text-neutral-300" : "text-[#000080]"}`}
        >
          Best Trades
        </h3>
        <ul className="space-y-2">
          {bestTrades.map((trade, index) => (
            <li
              key={index}
              className={`flex cursor-pointer items-center justify-between rounded-md p-2 transition-all duration-300 ease-in-out ${isDarkMode ? "hover:bg-[#1A99CE] dark:border-neutral-700 dark:hover:bg-[#2A2D3D]" : "border-gray-200 hover:bg-[#f0f0f0]"} ${index < bestTrades.length - 1 ? "border-b" : ""}`}
              onClick={() => handleTradeClick(trade)} // Add click handler
            >
              <div>
                <span
                  className={`block font-semibold ${isDarkMode ? "dark:text-neutral-300" : "text-[#000080]"}`}
                >
                  <span
                    className={`highlight ${isDarkMode ? "highlight-dark" : "highlight-light"}`}
                  >
                    {trade.symbol}
                  </span>{" "}
                  {/* Highlighted */}
                </span>
                <span
                  className={`text-sm ${isDarkMode ? "dark:text-neutral-400" : "text-[#000080]"}`}
                >
                  Entry Price:{" "}
                  <span className={`highlight`}>
                    ${trade.entryPrice.toFixed(2)}
                  </span>{" "}
                  | Exit Price:{" "}
                  <span className={`highlight`}>
                    ${trade.exitPrice.toFixed(2)}
                  </span>{" "}
                  {/* Highlighted */}
                </span>
              </div>
              <span
                className={`highlight font-bold ${isDarkMode ? "highlight-dark dark:text-neutral-300" : "highlight-light text-[#000080]"}`}
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
