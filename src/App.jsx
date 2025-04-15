/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import Workspace from "./components/Workspace";
import { DataContext } from "./DataContext";

function App() {
  const [dataState, setDataState] = useState();
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(0);
  useEffect(() => {
    const data = localStorage.getItem("dataState");
    if (data) setDataState(JSON.parse(data));
  }, []);
  useEffect(() => {
    if (!dataState) return;
    localStorage.setItem("dataState", JSON.stringify(dataState));
  },[dataState]);
  return (
    <DataContext.Provider
      value={{
        dataState: dataState || [],
        setDataState,
        selectedBoardIndex,
        setSelectedBoardIndex,
      }}
    >
      <div className="flex h-screen flex-col font-jakarta">
        <Header />
        <div className="flex flex-1">
          <SideMenu />
          <Workspace />
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
