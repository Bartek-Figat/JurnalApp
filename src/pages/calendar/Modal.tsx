import React, { useState } from "react";

interface ModalProps {
  onClose: () => void;
  payload: any[] | null;
}

const Modal: React.FC<ModalProps> = ({ onClose, payload }) => {
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  const toggleOpen = (index: number) => {
    setOpenStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative max-h-[calc(100%-100px)] w-full max-w-md transform rounded-lg bg-white p-2 shadow-2xl transition-transform dark:bg-[#151822]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md bg-gray-200 p-2 text-gray-600 transition duration-200 hover:text-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <h2 className="mb-6 text-center text-2xl font-semibold text-black dark:text-white">
          Event Details
        </h2>
        {payload ? (
          <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 flex max-h-[500px] flex-col gap-6 overflow-y-auto rounded-md p-4">
            {payload.map((event, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center rounded-lg bg-gray-100 p-4 dark:bg-[#0c0f17]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-2 rounded-2xl`}
                        style={{ backgroundColor: event.colorHex }}
                      ></div>
                      <div className="flex flex-col gap-1.5">
                        <p className="font-bold text-gray-400">Symbol</p>
                        <p className="dark:text-white">{event.symbol}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleOpen(index)}
                      className={`transition-transform duration-300 dark:text-white ${openStates[index] ? "rotate-180" : ""}`}
                      aria-label={
                        openStates[index] ? "Close details" : "Open details"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-down"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  <div
                    className={`mt-4 grid grid-cols-2 gap-y-5 transition-all duration-300 ease-in-out ${openStates[index] ? "max-h-[500px] opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">
                        Entry Date
                      </span>
                      <span className="dark:text-white">{event.startDate}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">Exit Date</span>
                      <span className="dark:text-white">{event.endDate}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">
                        Entry Price
                      </span>
                      <span className="dark:text-white">
                        ${event.entryPrice}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">
                        Exit Price
                      </span>
                      <span className="dark:text-white">
                        ${event.exitPrice}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">Loss</span>
                      <span className="dark:text-white">
                        -${(event.entryPrice - event.exitPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">
                        Gain Percentage
                      </span>
                      <span className="dark:text-white">
                        {event.gainPercentage}%
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">
                        Holding Period
                      </span>
                      <span className="dark:text-white">
                        {event.holdingPeriod} days
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">
                        Risk Reward Ratio
                      </span>
                      <span className="dark:text-white">
                        {event.riskRewardRatio}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-400">Fees</span>
                      <span className="dark:text-white">${event.fees}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No event details available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Modal;
