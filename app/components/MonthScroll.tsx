"use client";

import React, { useState, useRef, useEffect } from "react";

type Date = string;
interface GroupedItems {
  month: string;
  items: Date[];
}

const MonthScroll = () => {
  const initialItems: Date[] = [
    // Dummy data
    "2024-11-26T15:30:00Z",
    "2024-12-27T15:30:00Z",
    "2024-12-28T15:30:00Z",
    "2024-10-29T15:30:00Z",
    "2024-11-12T15:30:00Z",
    "2024-10-15T15:30:00Z",
    "2024-09-15T15:30:00Z",
    "2024-07-15T15:30:00Z",
    "2024-08-15T15:30:00Z",
    "2024-05-15T15:30:00Z",
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const getLatestMonth = (items: Date[]): string => {
    const sortedItems = items.sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
    return sortedItems[0].slice(0, 7);
  };

  const [selectedMonth, setSelectedMonth] = useState<string>(
    getLatestMonth(initialItems),
  );

  const groupItemsByMonth = (items: Date[]): GroupedItems[] => {
    const grouped: { [key: string]: Date[] } = {};

    items.forEach((item) => {
      const month = item.slice(0, 7);
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(item);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, items]) => ({
        month,
        items,
      }));
  };

  const [displayedItems, setDisplayedItems] = useState<GroupedItems[]>(
    groupItemsByMonth(initialItems),
  );

  const loadMoreItems = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedItems((prev) => {
        const combinedItems = [...prev, ...groupItemsByMonth(initialItems)];
        return combinedItems;
      });

      setIsLoading(false);
    }, 1000);
  };

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
    console.log(month);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isNearRight =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 200;

    if (isNearRight && !isLoading) {
      loadMoreItems();
    }
  };

  useEffect(() => {
    if (displayedItems.length > 0) {
      if (buttonContainerRef.current) {
        const latestMonthButton = buttonContainerRef.current.querySelector(
          `[data-month-btn="${selectedMonth}"]`,
        );

        const container = buttonContainerRef.current;
        const buttonOffset = (latestMonthButton as HTMLElement).offsetLeft;
        const containerWidth = container.clientWidth;
        const buttonWidth = (latestMonthButton as HTMLElement).offsetWidth;

        const scrollPosition = buttonOffset + buttonWidth - containerWidth;
        container.scrollLeft = scrollPosition;
      }
    }
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div
        ref={buttonContainerRef}
        className="flex gap-1 overflow-x-auto py-5"
        onScroll={handleScroll}
      >
        {displayedItems.map((group, index) => (
          <button
            key={`${group.month}-${index}`}
            data-month-btn={group.month}
            className={`flex flex-shrink-0 flex-col items-center justify-center px-4 py-2 text-lg font-semibold`}
            onClick={() => handleMonthClick(group.month)}
          >
            <span className="text-sm text-gray-600">
              {group.month.slice(0, 4)}年
            </span>
            <span
              className={`rounded-2xl px-3 py-2 text-sm font-medium ${
                group.month === selectedMonth
                  ? "bg-appleBlossom text-white"
                  : ""
              }`}
            >
              {group.month.slice(5)}月
            </span>
          </button>
        ))}
        {isLoading && (
          <div className="flex min-w-[160px] items-center justify-center">
            <div>Loading...</div>
          </div>
        )}
      </div>
      <div>{selectedMonth.toString()}</div>
    </div>
  );
};

export default MonthScroll;
