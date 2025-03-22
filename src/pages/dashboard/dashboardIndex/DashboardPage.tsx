import { BestTradesDisplay } from "./BestTradesDisplay";
import BraekDownPerfomance from "./BreakDown";
import ChartIndexPage from "./charts/chartIndexPage";
import PriceTicker from "./PriceTicker";

const DashboardIndex = () => {
  return (
    <>
      <PriceTicker />
      <BraekDownPerfomance />
      <ChartIndexPage />
      <BestTradesDisplay />
    </>
  );
};

export default DashboardIndex;
