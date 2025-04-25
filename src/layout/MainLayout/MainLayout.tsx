import React from "react";
import Header from "./components/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container px-2 mx-auto">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
