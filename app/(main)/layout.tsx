import React, { ReactNode } from "react";
import Navigation from "@/components/Navigation";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      {children}
      <Navigation />
    </>
  );
};

export default Layout;
