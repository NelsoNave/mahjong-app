"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStatsStore } from "@/store/useStatsStore";

const MonthScroll = () => {
  const { targetDate, setTargetDate, availableDate } = useStatsStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleButtonClick = (date: string) => {
    setTargetDate(date);
  };

  const buttonClass = (selectedDate: string) =>
    selectedDate === targetDate ? "bg-matrix font-semibold text-white" : "";

  useEffect(() => {
    setIsLoading(true);

    if (targetDate && availableDate?.length > 0) {
      const selectedIndex = availableDate.findIndex(
        (date) => date === targetDate,
      );
      if (selectedIndex !== -1 && selectedButtonRefs.current[selectedIndex]) {
        selectedButtonRefs.current[selectedIndex]?.scrollIntoView({
          block: "nearest",
          inline: "center",
        });
      }
    }
    setIsLoading(false);
  }, [targetDate, availableDate]);

  if (!availableDate || availableDate.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex gap-1 overflow-x-auto">
        {Array.isArray(availableDate) &&
          availableDate.map((date, index) => (
            <button
              key={`${date}-${index}`}
              ref={(el: HTMLButtonElement | null) => {
                selectedButtonRefs.current[index] = el;
              }}
              data-month-btn={date}
              className={`flex flex-shrink-0 flex-col items-center justify-center px-3 py-2 text-lg font-semibold`}
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
