import React, { useRef, useEffect, useCallback } from "react";
import { createChart, IChartApi, LineSeries } from "lightweight-charts";
import { useDarkMode } from "../../../../../contexts/DarkModeContext";

type LineChartProps = {
  data: Array<{ time: string | number; value: number }>;
};

const LineChart: React.FC<LineChartProps> = ({ data }) => {
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

    const lineSeries = chart.addSeries(LineSeries, {
      color: isDarkMode ? "rgba(38, 198, 218, 1)" : "rgba(38, 198, 218, 1)",
      lineWidth: 2,
    });

    lineSeries.setData(
      data.map(({ time, value }) => ({
        time: new Date(time).toISOString().split("T")[0],
        value,
      })),
    );

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

export default LineChart;
