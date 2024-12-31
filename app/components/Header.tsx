import React from "react";

type HeaderProps = {
  context: string;
};

const Header = ({ context }: HeaderProps) => {
  return (
    <header className="shadow-bottom flex h-16 items-center justify-center border-0.5 border-b-slate-400 text-lg font-semibold">
      {context}
    </header>
  );
};

export default Header;
