import React from "react";

type Props = {};

const BalanceCard = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="text-sm">収入</p>
        <p>
          <span>10000</span>P
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">支出</p>
        <p>
          <span>100000</span>P
        </p>
      </div>
      <p className="border-b border-black"></p>
      <div className="flex justify-between">
        <p className="text-sm font-semibold">総合</p>
        <p>
          <span>10000000</span>P
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
