import React, { useRef, useEffect, useCallback } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineSeries,
} from "lightweight-charts";
import { useDarkMode } from "../../../../../contexts/DarkModeContext";

type AreaChartProps = {
  data1: Array<{ time: string | number; value: number }>;
  data2: Array<{ time: string | number; value: number }>;
};

const AreaChart1: React.FC<AreaChartProps> = ({ data1, data2 }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeries1Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const lineSeries2Ref = useRef<ISeriesApi<"Line"> | null>(null);
  const { isDarkMode } = useDarkMode();
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: isDarkMode ? "#151822" : "#ffffff" },
        textColor: isDarkMode ? "#ffffff" : "#3b3131",
        attributionLogo: false,
      },

      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
    });

    chart.applyOptions({
      timeScale: {
        borderColor: isDarkMode ? "#683747" : "#29171d",
      },
      rightPriceScale: {
        borderColor: isDarkMode ? "#683747" : "#29171d",
      },
    });

    // Create first line series
    const lineSeries1 = chart.addSeries(LineSeries, {
      color: "rgba(255, 0, 0, 1)",
      lineWidth: 2,
      baseLineColor: "#71649C",
    });
    lineSeries1.setData(
      data1.map(({ time, value }) => ({
        time: new Date(time).toISOString().split("T")[0],
        value,
      })),
    );
    lineSeries1Ref.current = lineSeries1;

    // Create second line series
    const lineSeries2 = chart.addSeries(LineSeries, {
      color: "rgba(50, 205, 50, 0.8)",
      lineWidth: 2,
    });
    lineSeries2.setData(
      data2.map(({ time, value }) => ({
        time: new Date(time).toISOString().split("T")[0],
        value,
      })),
    );
    lineSeries2Ref.current = lineSeries2;

    // Tooltip setup
    const toolTip = document.createElement("div");
    toolTip.className =
      "z-10 w-[200px] h-[120px] absolute hidden box-border text-center z-1000 pointer-events-none rounded-lg shadow-xl transition-opacity duration-300 opacity-0 " +
      (isDarkMode ? "bg-gray-900" : "bg-white") +
      " " +
      (isDarkMode ? "text-gray-200" : "text-gray-800") +
      " border border-gray-300";
    chartContainerRef.current.appendChild(toolTip);

    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current!.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainerRef.current!.clientHeight
      ) {
        toolTip.style.opacity = "0";
        toolTip.style.display = "none"; // Hide the tooltip
      } else {
        const dateStr = param.time;
        toolTip.style.opacity = "1";
        toolTip.style.display = "block"; // Show the tooltip
        const data1 = param.seriesData.get(lineSeries1);
        const data2 = param.seriesData.get(lineSeries2);
        let price1 = 0;
        let price2 = 0;
        if (data1 && "value" in data1) {
          price1 = data1.value;
        }
        if (data2 && "value" in data2) {
          price2 = data2.value;
        }
        toolTip.innerHTML = `
        <div class="flex flex-col justify-center ">
        <div class="bg-green-600/40 text-white p-2  shadow-lg mb-3"> ${dateStr}</div>
        <div class="text-${isDarkMode ? "gray-300" : "text-black"}  text-md p-1">Price: ${Math.round(100 * price1) / 100}</div>
        <div class="text-${isDarkMode ? "gray-300" : "text-black"}  text-md p-1">Price: ${Math.round(100 * price2) / 100}</div> 
        </div>
    `;
        const coordinate1 = lineSeries1.priceToCoordinate(price1);
        const coordinate2 = lineSeries2.priceToCoordinate(price2);
        let shiftedCoordinate = param.point.x - 60;
        if (coordinate1 === null || coordinate2 === null) {
          return;
        }
        shiftedCoordinate = Math.max(
          0,
          Math.min(
            chartContainerRef.current!.clientWidth - 120,
            shiftedCoordinate,
          ),
        );
        const coordinateY =
          Math.min(coordinate1, coordinate2) - 80 - 15 > 0
            ? Math.min(coordinate1, coordinate2) - 80 - 15
            : Math.max(
                0,
                Math.min(
                  chartContainerRef.current!.clientHeight - 80 - 15,
                  Math.max(coordinate1, coordinate2) + 15,
                ),
              );
        toolTip.style.left = shiftedCoordinate + "px";
        toolTip.style.top = coordinateY + "px";
      }
    });
    chart.timeScale().fitContent();
    chartRef.current = chart;
  }, [data1, data2, isDarkMode]);

  useEffect(() => {
    initializeChart();

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !chartRef.current) return;
      const { width, height } =
        chartContainerRef.current!.getBoundingClientRect();
      chartRef.current.applyOptions({ width, height });
    });

    const currentContainer = chartContainerRef.current;
    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [initializeChart]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
      }}
    />
  );
};

export default AreaChart1;
