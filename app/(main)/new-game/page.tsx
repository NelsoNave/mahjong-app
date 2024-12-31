import React from "react";
import SelectTypeButton from "@/components/SelectTypeButtun";
import Header from "@/components/Header";

const page = () => {
  return (
    <>
      <Header context="新規対局登録" />
      <section className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="flex flex-col justify-center gap-8 p-6">
          <p className="m-0 text-center text-sm">対戦形式を選択してください</p>
          <div className="flex flex-col justify-center gap-6">
            <SelectTypeButton color="pineGlade" type={4}>
              4人麻雀
            </SelectTypeButton>
            <SelectTypeButton color="appleBlossom" type={3}>
              3人麻雀
            </SelectTypeButton>
            {/* <SelectTypeBtn color="denim" type="free">
              フリー麻雀
            </SelectTypeBtn> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default page;