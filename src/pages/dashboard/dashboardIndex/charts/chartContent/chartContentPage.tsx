import React, { useRef, useEffect, useCallback } from "react";
import {
  createChart,
  IChartApi,
  AreaSeries,
  createTextWatermark,
} from "lightweight-charts";
import { useDarkMode } from "../../../../../contexts/DarkModeContext";

type AreaChartProps = {
  data: Array<{ time: string | number; value: number }>;
};

const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
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
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          labelVisible: false,
        },
      },
    });

    createTextWatermark(chart.panes()[0], {
      horzAlign: "center",
      vertAlign: "bottom",
      lines: [
        {
          text: "Watermark Example",
          color: "#000",
          fontSize: 24,
        },
      ],
    });

    chart.applyOptions({
      leftPriceScale: {
        visible: true,
        borderColor: "transparent",
      },
      timeScale: {
        visible: true,
      },
      rightPriceScale: {
        visible: false,
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: isDarkMode
        ? "rgba(38, 198, 218, 0.56)"
        : "rgba(38, 198, 218, 0.56)",
      bottomColor: isDarkMode
        ? "rgba(38, 198, 218, 0.04)"
        : "rgba(38, 198, 218, 0.04)",
      lineColor: isDarkMode ? "rgba(38, 198, 218, 1)" : "rgba(38, 198, 218, 1)",
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });

    areaSeries.setData(
      data.map(({ time, value }) => ({
        time: new Date(time).toISOString().split("T")[0],
        value,
      })),
    );

    const toolTip = document.createElement("div");
    toolTip.style.width = "120px";
    toolTip.style.height = "auto";
    toolTip.style.position = "absolute";
    toolTip.style.display = "none";
    toolTip.style.padding = "10px";
    toolTip.style.boxSizing = "border-box";
    toolTip.style.fontSize = "14px";
    toolTip.style.textAlign = "left";
    toolTip.style.zIndex = "1000";
    toolTip.style.pointerEvents = "none";
    toolTip.style.border = "1px solid";
    toolTip.style.borderRadius = "8px";
    toolTip.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    toolTip.style.transition = "opacity 0.3s ease";
    toolTip.style.opacity = "0";
    toolTip.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif';
    toolTip.style.background = isDarkMode ? "#333" : "white";
    toolTip.style.color = isDarkMode ? "#fff" : "black";
    toolTip.style.borderColor = "#2962FF";
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
        toolTip.style.display = "none";
      } else {
        const dateStr = param.time;
        toolTip.style.opacity = "1";
        toolTip.style.display = "block";
        const data = param.seriesData.get(areaSeries);
        let price = 0;
        if (data) {
          if ("value" in data) {
            price = data.value;
          } else if ("close" in data) {
            price = data.close;
          }
        }
        toolTip.innerHTML = `<div style="color: #2962FF; font-weight: bold;">Apple Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${isDarkMode ? "#fff" : "black"}">
            ${Math.round(100 * price) / 100}
            </div><div style="color: ${isDarkMode ? "#aaa" : "black"}">
            ${dateStr}
            </div>`;

        const coordinate = areaSeries.priceToCoordinate(price);
        let shiftedCoordinate = param.point.x - 60;
        if (coordinate === null) {
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
          coordinate - 80 - 15 > 0
            ? coordinate - 80 - 15
            : Math.max(
                0,
                Math.min(
                  chartContainerRef.current!.clientHeight - 80 - 15,
                  coordinate + 15,
                ),
              );
        toolTip.style.left = shiftedCoordinate + "px";
        toolTip.style.top = coordinateY + "px";
      }
    });
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

export default AreaChart;
