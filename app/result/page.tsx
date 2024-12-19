import React from "react";
import Navigation from "../components/Navigation";
import SignOut from "../components/SignOut";

const page = () => {
  return (
    <>
      <div>
        <h1>This is your results</h1>
      </div>
      <SignOut />
      <Navigation />
    </>
  );
};

export default page;
