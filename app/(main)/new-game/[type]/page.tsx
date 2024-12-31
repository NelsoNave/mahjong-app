import React from "react";
import RecordForm from "@/components/RecordForm";
import Header from "@/components/Header";

// type Props = {

// }

const page = () => {
  return (
    <>
      <Header context="記録作成" />
      <section className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="flex flex-col justify-center gap-8 p-6">
          <RecordForm />
        </div>
      </section>
    </>
  );
};

export default page;
