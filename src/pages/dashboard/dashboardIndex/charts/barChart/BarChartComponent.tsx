import React, { useRef, useEffect, useCallback } from "react";
import { createChart, IChartApi, BarData, BarSeries } from "lightweight-charts";
import { useDarkMode } from "../../../../../contexts/DarkModeContext";

type BarChartProps = {
  data: Array<{
    time: string | number;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
};

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { isDarkMode } = useDarkMode();

  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: isDarkMode ? "#151822" : "#ffffff" },
        textColor: isDarkMode ? "#ffffff" : "#000000",
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
    });

    const barSeries = chart.addSeries(BarSeries, {
      upColor: isDarkMode ? "rgba(38, 198, 218, 1)" : "rgba(38, 198, 218, 1)",
      downColor: isDarkMode ? "rgba(255, 0, 0, 1)" : "rgba(255, 0, 0, 1)",
      openVisible: true,
      thinBars: true,
    });

    // Convert time to a string format if necessary
    const formattedData: BarData[] = data.map((item) => ({
      time:
        typeof item.time === "number"
          ? new Date(item.time * 1000).toISOString().split("T")[0]
          : item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    barSeries.setData(formattedData);

    chart.timeScale().fitContent();
    chartRef.current = chart;
  }, [data, isDarkMode]);

  useEffect(() => {
    initializeChart();

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !chartRef.current) return;
      const { width, height } =
        chartContainerRef.current!.getBoundingClientRect();
      chartRef.current.applyOptions({ width, height });
    });

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
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
        height: "400px",
        minHeight: "300px",
      }}
    />
  );
};

export default BarChart;
