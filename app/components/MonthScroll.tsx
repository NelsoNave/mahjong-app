"use client";

import React, { useState, useRef } from "react";
import { useStatsStore } from "@/store/useStatsStore";

const MonthScroll = () => {
  const { targetDate, setTargetDate, availableDate, setDisplayDate } =
    useStatsStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const loadMoreItems = () => {
    if (!availableDate || availableDate.length === 0 || isLoading) return;

    setDisplayDate();
  };

  const handleButtonClick = (date: string) => {
    setTargetDate(date);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!targetDate) return;
    const container = e.currentTarget;

    const isNearRight =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 200;

    if (isNearRight && !isLoading) {
      setIsLoading(true);
      loadMoreItems();
      setIsLoading(false);
    }
  };

  const buttonClass = (selectedDate: string) =>
    selectedDate === targetDate ? "bg-matrix font-semibold text-white" : "";

  if (!availableDate || availableDate.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div
        ref={buttonContainerRef}
        className="flex gap-1 overflow-x-auto"
        onScroll={handleScroll}
      >
        {Array.isArray(availableDate) &&
          availableDate.map((date, index) => (
            <button
              key={`${date}-${index}`}
              data-month-btn={date}
              className="flex flex-shrink-0 flex-col items-center justify-center px-3 py-2 text-lg font-semibold"
              onClick={() => handleButtonClick(date)}
            >
              <span className="text-sm font-medium text-gray-600">
                {date.slice(0, 4)}年
              </span>
              <span
                className={`rounded-3xl px-3 py-1 text-sm font-medium ${buttonClass(date)}`}
              >
                {date.slice(5)}月
              </span>
            </button>
          ))}
        {isLoading && (
          <div className="flex min-w-[160px] items-center justify-center">
            <div>Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthScroll;
