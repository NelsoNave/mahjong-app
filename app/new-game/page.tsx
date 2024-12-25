import React from "react";
import Navigation from "../components/Navigation";
import SelectTypeBtn from "@/components/SelectTypeBtn";

const page = () => {
  return (
    <>
      <section className="flex flex-1 flex-col overflow-auto min-h-0">
        <div className="flex flex-col justify-center gap-8 p-6">
          <p className="m-0 text-center text-sm">対戦形式を選択してください</p>
          <div className="flex flex-col justify-center gap-6">
            <SelectTypeBtn color="pineGlade" type={4}>
              4人麻雀
            </SelectTypeBtn>
            <SelectTypeBtn color="appleBlossom" type={3}>
              3人麻雀
            </SelectTypeBtn>
            {/* <SelectTypeBtn color="denim" type="free">
              フリー麻雀
            </SelectTypeBtn> */}
          </div>
        </div>
      </section>
      <Navigation />
    </>
  );
};

export default page;
