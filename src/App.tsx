import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./routes";
import { MainMenu } from "./components/Menu";
import "./App.css";

export default function App() {
  return (
    <Router>
      <MainMenu />
      <Routes />
    </Router>
  );
}
