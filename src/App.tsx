import "./App.css";
import { useAppSelector } from "./app/hooks";
import { selectTable } from "./features/table/tableSlice";
import SplitView from "./components/SplitView";
import Dashboard from "./components/Dashboard";
import { useEffect, useState } from "react";
import { observeNode } from "./app/observe";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  let table = useAppSelector(selectTable);
  let [loaded, setLoaded] = useState("");
  let [pyScriptLoaded, setPyScriptLoaded] = useState(false);
  observeNode("pyscript_loaded", (x) => setLoaded(x.target.textContent!));

  useEffect(() => {
    setPyScriptLoaded(loaded.includes("true"));
  }, [loaded]);

  if (!pyScriptLoaded) {
    return <LoadingScreen />;
  }
  if (table.loaded) {
    return <SplitView />;
  } else {
    return <Dashboard />;
  }
}

export default App;
