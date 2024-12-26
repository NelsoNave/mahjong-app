import React from "react";

type Props = {};

const TotalCostResultCard = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="text-sm">ゲーム代</p>
        <p>
          <span>10000</span>P
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">ゲーム代込</p>
        <p>
          <span>100000</span>P
        </p>
      </div>
    </div>
  );
};

export default TotalCostResultCard;
