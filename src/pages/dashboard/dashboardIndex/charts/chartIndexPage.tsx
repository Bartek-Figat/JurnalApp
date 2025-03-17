import Aerachart from "./areaChart/AreaChart";
import ChartComponent from "./chartContent/chartContentPage";
import LineChartComponent from "./lineChart/LineChartComponent";
import BarChart from "./barChart/BarChartComponent";
import { barChartData, staticData, staticData2 } from "../../data/priceData";

const ChartIndexPage = () => {
  return (
    <div className="grid grid-cols-1 gap-6 bg-white p-6 dark:bg-[#0C0F17] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <div className="relative rounded-lg p-1 shadow-lg dark:shadow-xl">
        <Aerachart data1={staticData} data2={staticData2} />
      </div>
      <div className="relative rounded-lg p-1 shadow-lg dark:shadow-xl">
        <ChartComponent data={staticData} />
      </div>
      <div className="relative rounded-lg p-1 shadow-lg dark:shadow-xl">
        <LineChartComponent data={staticData} />
      </div>
      <div className="relative rounded-lg p-1 shadow-lg dark:shadow-xl">
        <BarChart data={barChartData} />
      </div>
    </div>
  );
};

export default ChartIndexPage;
