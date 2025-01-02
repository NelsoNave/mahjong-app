"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStatsStore } from "@/store/useStatsStore";

const MonthScroll = () => {
  const { targetDate, setTargetDate, availableDate, setAvailableDate } =
    useStatsStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const loadMoreItems = async () => {
    if (isLoading || !availableDate) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAvailableDate(availableDate);
    setIsLoading(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!targetDate) return;
    const container = e.currentTarget;

    const isNearRight =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 200;

    if (isNearRight && !isLoading) {
      loadMoreItems();
    }
  };

  useEffect(() => {
    if (buttonContainerRef.current && targetDate && isFirstLoad) {
      const selectedButton = buttonContainerRef.current.querySelector(
        `[data-month-btn="${targetDate}"]`,
      ) as HTMLElement;

      if (selectedButton) {
        const container = buttonContainerRef.current;
        const buttonOffset = selectedButton.offsetLeft;
        const containerWidth = container.clientWidth;
        const buttonWidth = selectedButton.offsetWidth;

        container.scrollLeft = buttonOffset + buttonWidth - containerWidth;
      }

      setIsFirstLoad(false);
    }
  }, [targetDate, availableDate, isFirstLoad]);

  const buttonClass = (group: string) =>
    group === targetDate ? "bg-matrix font-semibold text-white" : "";

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
          availableDate.map((group, index) => (
            <button
              key={`${group}-${index}`}
              data-month-btn={group}
              className="flex flex-shrink-0 flex-col items-center justify-center px-4 py-2 text-lg font-semibold"
              onClick={() => setTargetDate(group)}
            >
              <span className="text-sm font-medium text-gray-600">
                {group.slice(0, 4)}年
              </span>
              <span
                className={`rounded-3xl px-3 py-1 text-sm font-medium ${buttonClass(group)}`}
              >
                {group.slice(5)}月
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
