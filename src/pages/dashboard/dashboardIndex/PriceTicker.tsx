import { prices } from "../data/priceData";

const PriceTicker = () => {
  return (
    <div className="flex flex-col justify-center overflow-hidden bg-white p-2 text-gray-900 dark:bg-[#0C0F17] dark:text-gray-200 max-md:pt-20">
      <div className="animate-scroll flex">
        {prices.map((item, index) => (
          <div key={index} className="mx-4 flex flex-col items-center">
            <span className="text-sm">{item.symbol}</span>
            <span className="text-lg font-bold">
              {item.exitPrice.toFixed(2)}
            </span>
            <span
              className={`text-xs ${
                parseFloat(item.gainPercentage) > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {item.gainPercentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
