import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style.css";
import { tw } from "../../helpers/tw";
import { useEffect, useMemo, useRef, useState } from "react";
import { groupEventsByStartDate } from "./useVerticalCalendar";
import { useTradeData } from "./useTradeData";
import { differenceInDays, parseISO } from "date-fns";
import type { MOCK_DATA } from "./mockData";
import Modal from "./Modal";
import { TabSwitcher } from "./TabSwitcher";

enum CalendarType {
  MONTH = "dayGridMonth",
  WEEK = "dayGridWeek",
  DAY = "dayGridDay",
}

export default function Calendar() {
  const { data } = useTradeData();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogPayload, setDialogPayload] = useState<[] | null>(null);

  const normalizedData = useMemo(() => {
    if (!data) return [];

    return transformTrades(data);
  }, [data]);
  const [currentContainerId, changeContainerId] = useState<CalendarType>(
    CalendarType.MONTH,
  );
  const calendarRef = useRef<FullCalendar | null>(null);

  const handleViewChange = (viewType: CalendarType) => {
    changeContainerId(viewType);
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi) {
      calendarApi.changeView(viewType);
    }
  };

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 640) {
      handleViewChange(CalendarType.DAY);
    } else if (width < 1024) {
      handleViewChange(CalendarType.WEEK);
    } else {
      handleViewChange(CalendarType.MONTH);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const groupedByStartDateEvents = useMemo(
    () => groupEventsByStartDate({ events: normalizedData }),
    [normalizedData],
  );

  const formattedEvents = useMemo(() => {
    return Object.entries(groupedByStartDateEvents).map(
      ([startDate, eventsGroup]) => {
        const isGrouped = eventsGroup.length > 1;
        const event = eventsGroup[0];

        const endDate = new Date(event.endDate);
        endDate.setDate(endDate.getDate() + 1);

        return {
          start: startDate,
          // end: isGrouped ? startDate : endDate.toISOString().split("T")[0],
          end: startDate,
          backgroundColor: isGrouped ? "#0052CC" : event.colorHex,
          borderColor: "transparent",
          extendedProps: { events: eventsGroup, isGrouped },
        };
      },
    );
  }, [groupedByStartDateEvents]);

  return (
    <>
      <div className="flex flex-col gap-12 p-12 dark:bg-[#0c0f17] sm:mt-2 md:mt-0 lg:mt-0">
        <div className="flex flex-col gap-4 rounded-md bg-gray-100/50 p-6 dark:bg-[#151822]">
          <TabSwitcher
            tabs={[
              { value: CalendarType.MONTH, text: "Months" },
              { value: CalendarType.WEEK, text: "Weeks" },
              { value: CalendarType.DAY, text: "Days" },
            ]}
            currentTab={currentContainerId}
            layoutId="calendar-bubble"
            tabOnClick={handleViewChange}
            wrapperClassName="absolute w-max"
            tabProps={{ className: "px-6" }}
          />

          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView={currentContainerId}
            headerToolbar={{
              left: "",
              center: "",
              right: "prev,next",
            }}
            ref={calendarRef}
            viewDidMount={(arg) =>
              handleViewChange(arg.view.type as CalendarType)
            }
            dayCellClassNames={({ isToday, isOther }) => {
              return tw(
                "dark:bg-[#151822] text-black dark:text-white font-bold text-lg transition duration-300 ease-in-out",
                isToday && "border-2 border-blue-500",
                isOther &&
                  "dark:text-blue-300 text-blue-500 hover:text-blue-700",
                "dark:border-gray-600 border-gray-300",
              );
            }}
            dayHeaderClassNames={() => {
              return "dark:bg-[#0c0f17] py-4! dark:border-gray-600 border-gray-300";
            }}
            firstDay={1}
            dayHeaderFormat={{ weekday: "long" }}
            events={formattedEvents}
            eventContent={(arg: {
              event: {
                extendedProps: { events: string | any[]; isGrouped: any };
              };
            }) => {
              const event = arg.event.extendedProps.events[0];
              const isGrouped = arg.event.extendedProps.isGrouped;

              return (
                <div className="mt-auto flex justify-between p-3">
                  {isGrouped ? (
                    <div>+{arg.event.extendedProps.events.length}</div>
                  ) : (
                    <>
                      <div className="text-xs font-bold text-white">
                        {event.symbol}
                      </div>
                      <div className="text-xs text-white">
                        {event.isProfit ? "Profit" : "Loss"}
                      </div>
                    </>
                  )}
                </div>
              );
            }}
            eventClassNames={(arg) => {
              const isGrouped = arg.event.extendedProps.isGrouped;

              return tw(
                "cursor-pointer",
                isGrouped && "w-fit size-[45px] flex items-center",
              );
            }}
            eventClick={(arg) => {
              console.log(arg.event.extendedProps.events);
              setDialogPayload(arg.event.extendedProps.events);
              setIsDialogOpen((isOpen) => !isOpen);
            }}
          />
        </div>
      </div>

      {isDialogOpen && (
        <Modal
          onClose={() => setIsDialogOpen(false)} // Close modal handler
          payload={dialogPayload} // Pass the dialog payload to the modal
        />
      )}
    </>
  );
}

function transformTrades(trades: typeof MOCK_DATA) {
  return trades.map((trade) => ({
    id: trade._id?.$oid || "",
    symbol: trade.symbol,
    startDate: trade.entryDate?.$date?.split("T")[0] || "",
    endDate: trade.exitDate?.$date?.split("T")[0] || "",
    entryPrice: trade.entryPrice,
    exitPrice: trade.exitPrice,
    profitLoss: (trade.exitPrice - trade.entryPrice).toFixed(2),
    gainPercentage: (
      ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) *
      100
    ).toFixed(2),
    holdingPeriod:
      trade.exitDate?.$date && trade.entryDate?.$date
        ? differenceInDays(
            parseISO(trade.exitDate.$date),
            parseISO(trade.entryDate.$date),
          )
        : 0,
    riskRewardRatio: (trade.reward / trade.risk).toFixed(2),
    fees: trade.fees || 0,
    isProfit: trade.exitPrice > trade.entryPrice,
    colorHex: trade.exitPrice > trade.entryPrice ? "#00C853" : "#FE4543",
  }));
}
