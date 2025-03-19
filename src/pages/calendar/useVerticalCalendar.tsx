import {
  addMonths,
  differenceInDays,
  endOfMonth,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useEffectOnceWhen } from "../../hooks/useEffectOnceWhen";

export const useVerticalCalendar = <T extends Event>({
  events,
  options: { dayHeight: _dayHeight = 40, paddingValue: _paddingValue = 4 },
}: {
  events: T[];
  options: { paddingValue?: number; dayHeight?: number };
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [days, setDays] = useState<
    { date: Date; isToday: boolean; id: string }[]
  >([]);

  const handleMonthChange = useCallback(
    (type: "prev" | "next") => {
      const handleChange = (month: Date) => {
        const newMonthDays = generateDays(month);
        setDays(newMonthDays);

        return month;
      };

      setCurrentMonth(
        type === "next"
          ? handleChange(addMonths(currentMonth, 1))
          : handleChange(subMonths(currentMonth, 1)),
      );
    },
    [currentMonth],
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const startDate = parseISO(event.startDate);
        const endDate = parseISO(event.endDate || event.startDate);
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        // Include events that:
        // 1. Start in the current month
        // 2. End in the current month
        // 3. Span across the current month (start before and end after)
        return (
          isSameMonth(startDate, currentMonth) ||
          isSameMonth(endDate, currentMonth) ||
          (startDate <= monthEnd && endDate >= monthStart)
        );
      }),
    [currentMonth, events],
  );

  const groupedByStartDateEvents = useMemo(
    () => groupEventsByStartDate({ events: filteredEvents }),
    [filteredEvents],
  );
  const overlappingEvents = useMemo(
    () => groupOverlappingEvents({ events: groupedByStartDateEvents }),
    [groupedByStartDateEvents],
  );

  const calculateEventPosition = useCallback(
    (event: EventOrGrouped<T>, index: number, totalInGroup: number) => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate || event.startDate);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const effectiveStartDate =
        startDate < monthStart ? monthStart : startDate;
      const isFadingToNextMonth = endDate > monthEnd;
      const isFadingFromPrevMonth = startDate < monthStart;

      const startDay = effectiveStartDate.getDate();

      const duration =
        differenceInDays(
          endDate < monthEnd ? endDate : monthEnd,
          effectiveStartDate,
        ) + 1;

      const dayHeight = _dayHeight;
      const paddingValue = _paddingValue;

      const top =
        (startDay - 1) * dayHeight + (isFadingFromPrevMonth ? 0 : paddingValue);
      let height = duration * dayHeight;

      if (isFadingFromPrevMonth && isFadingToNextMonth) {
        // Event spans from previous month to next month - no padding
      } else if (isFadingFromPrevMonth) {
        // Event starts in previous month - only bottom padding
        height = height - paddingValue;
      } else if (isFadingToNextMonth) {
        // Event extends to next month - only top padding
        height = height - paddingValue;
      } else {
        // Event fully within current month - both paddings
        height = height - paddingValue * 2;
      }

      const width = 100 / totalInGroup;
      const left = index * width;

      return {
        top,
        height,
        width,
        left,
        isFadingToNextMonth,
        isFadingFromPrevMonth,
      };
    },
    [_paddingValue, _dayHeight, currentMonth],
  );

  useEffectOnceWhen(() => {
    const days = generateDays(currentMonth);

    setDays(days);
  }, !!currentMonth);

  return {
    days,
    currentMonth,
    overlappingEvents,
    handleMonthChange,
    calculateEventPosition,
  };
};

const generateDays = (currentMonth: Date) => {
  const startOfMonthDate = startOfMonth(currentMonth);
  const endOfMonthDate = endOfMonth(currentMonth);
  const daysInMonth = endOfMonthDate.getDate();

  const daysArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(startOfMonthDate);
    day.setDate(i);
    daysArray.push({
      id: `${day.toString()}_${i}`,
      date: day,
      isToday: isToday(day),
    });
  }

  return daysArray;
};

export const groupEventsByStartDate = <T extends Event>({
  events,
}: {
  events: T[];
}) => {
  const groupedEvents: Record<string, T[]> = {};

  for (const event of events) {
    const startDate = event.startDate;

    if (!groupedEvents[startDate]) {
      groupedEvents[startDate] = [];
    }

    groupedEvents[startDate].push(event);
  }

  return groupedEvents;
};

export const groupOverlappingEvents = <T extends Event>({
  events,
}: {
  events: Record<string, T[]>;
}) => {
  const allEventsFlat: EventOrGrouped<T>[] = [];

  for (const [startDate, dateEvents] of Object.entries(events)) {
    if (dateEvents.length > 1) {
      allEventsFlat.push({
        ...dateEvents[0],
        endDate: startDate,
        isGrouped: true,
        groupEvents: dateEvents,
      });
    } else {
      allEventsFlat.push(...dateEvents);
    }
  }

  const overlapGraph: Map<
    EventOrGrouped<T>,
    Set<EventOrGrouped<T>>
  > = new Map();

  for (const event of allEventsFlat) {
    overlapGraph.set(event, new Set());
  }

  for (let i = 0; i < allEventsFlat.length; i++) {
    const event1 = allEventsFlat[i];
    const event1Start = parseISO(event1.startDate);
    const event1End = parseISO(event1.endDate || event1.startDate);

    for (let j = i + 1; j < allEventsFlat.length; j++) {
      const event2 = allEventsFlat[j];
      const event2Start = parseISO(event2.startDate);
      const event2End = parseISO(event2.endDate || event2.startDate);

      if (event1Start <= event2End && event1End >= event2Start) {
        overlapGraph.get(event1)?.add(event2);
        overlapGraph.get(event2)?.add(event1);
      }
    }
  }

  const eventGroups: Array<EventOrGrouped<T>[]> = [];
  const processedEvents = new Set<EventOrGrouped<T>>();

  for (const event of allEventsFlat) {
    if (processedEvents.has(event)) continue;

    const group: EventOrGrouped<T>[] = [];
    const queue: EventOrGrouped<T>[] = [event];
    processedEvents.add(event);

    while (queue.length > 0) {
      const currentEvent = queue.shift();
      if (currentEvent) {
        group.push(currentEvent);

        const neighbors = overlapGraph.get(currentEvent);
        if (neighbors) {
          for (const neighbor of neighbors) {
            if (!processedEvents.has(neighbor)) {
              processedEvents.add(neighbor);
              queue.push(neighbor);
            }
          }
        }
      }
    }

    eventGroups.push(group);
  }

  return eventGroups.map((group) => ({
    events: group,
    isOverlapped: group.length > 1,
  }));
};

export interface Event {
  startDate: string;
  endDate: string;
  colorHex?: string;
}

export interface GroupedEvent<T extends Event> extends Event {
  isGrouped: true;
  groupEvents: T[];
}

export type EventOrGrouped<T extends Event> = T | GroupedEvent<T>;
