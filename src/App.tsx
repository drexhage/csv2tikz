import "./App.css";
import { useAppSelector } from "./app/hooks";
import { selectTable } from "./features/table/tableSlice";
import SplitView from "./components/SplitView";
import Dashboard from "./components/Dashboard";

function App() {
  let table = useAppSelector(selectTable);

  if (table.loaded) {
    return <SplitView />;
  } else {
    return <Dashboard />
  }
}

export default App;
