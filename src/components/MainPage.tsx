import React from "react";
import Header from "./Header";

const MainPage = (props: any) => {
  return (
    <div>
      <Header />
      <div className="content mt-5">{props.children}</div>
    </div>
  );
};

export default MainPage;
