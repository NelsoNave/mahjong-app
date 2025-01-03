import React, { ReactNode } from "react";
import Navigation from "@/components/Navigation";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      {children}
      <Navigation />
    </div>
  );
};

export default Layout;
