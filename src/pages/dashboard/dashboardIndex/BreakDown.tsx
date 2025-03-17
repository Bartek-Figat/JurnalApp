import {
  ChartLineIcon,
  CircleDollarSignIcon,
  ReceiptIcon,
  WalletIcon,
} from "lucide-react";

const data = [
  {
    icon: ChartLineIcon,
    change: "+15.75%",
    label: "Stock Growth: 120.00%",
    bgColor: "rgb(25, 118, 210)",
  },
  {
    icon: CircleDollarSignIcon,
    change: "+10.50%",
    label: "Investment Return: 80.00%",
    bgColor: "rgb(48, 63, 159)",
  },
  {
    icon: ReceiptIcon,
    change: "+5.25%",
    label: "Expense Ratio: 60.00%",
    bgColor: "rgb(0, 121, 107)",
  },
  {
    icon: WalletIcon,
    change: "+12.00%",
    label: "Savings Rate: 90.00%",
    bgColor: "rgb(77, 208, 225)",
  },
];

const portfolios = [
  {
    title: "Tech Portfolio",
    change: "+7.5%",
    entryPrice: "$120.50",
    investments: 150,
    value: "$18,750.00",
    returnsRate: "+25.00%",
    overview: "Invest in leading technology companies and innovations.",
  },
  {
    title: "Real Estate Portfolio",
    change: "+3.8%",
    entryPrice: "$250.00",
    investments: 50,
    value: "$12,500.00",
    returnsRate: "+15.00%",
    overview: "Diversify your investments with real estate assets.",
  },
  {
    title: "Bond Portfolio",
    change: "+2.1%",
    entryPrice: "$100.00",
    investments: 200,
    value: "$20,000.00",
    returnsRate: "+10.00%",
    overview: "Stable returns through government and corporate bonds.",
  },
  {
    title: "Crypto Portfolio",
    change: "+12.3%",
    entryPrice: "$45,000.00",
    investments: 10,
    value: "$450,000.00",
    returnsRate: "+50.00%",
    overview:
      "Explore the world of cryptocurrencies and blockchain technology.",
  },
];

const BraekDownPerfomance = () => {
  return (
    <div className="flex flex-col gap-6 p-8 text-white dark:bg-[#0C0F17]">
      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {portfolios.map((portfolio, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border-gray-700 p-4 shadow-md dark:bg-[#151822]"
            >
              <h3 className="flex flex-row justify-between text-xl font-bold text-gray-900 dark:text-gray-200">
                {portfolio.title}
                <p className="text-lg text-green-400">{portfolio.change}</p>
              </h3>
              <div className="mb-6 text-gray-800 dark:text-gray-400">
                <p className="text-sm">Entry Price: {portfolio.entryPrice}</p>
                <p className="text-sm">
                  Number of Investments: {portfolio.investments}
                </p>
                <p className="text-sm">Portfolio Value: {portfolio.value}</p>
                <p className="text-sm">Returns Rate: {portfolio.returnsRate}</p>
                <p className="text-sm">Overview: {portfolio.overview}</p>
              </div>

              <button className="mt-auto w-fit rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                View Details
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 shadow-md md:grid-cols-2 lg:grid-cols-1">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-md p-2 dark:bg-[#151822]"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  color: "rgb(100, 181, 246)",
                  backgroundColor: item.bgColor,
                }}
              >
                <item.icon className="text-gray-200" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg text-green-600">{item.change}</p>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BraekDownPerfomance;
