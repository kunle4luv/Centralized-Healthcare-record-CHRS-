import { useState } from "react";
import DashboardDemo from "./components/body/dashboard";
import Home from "./components/body/home";

export default function App() {
  const [view, setView] = useState<"home" | "dashboard">("home");

  if (view === "home") {
    return <Home onGetStarted={() => setView("dashboard")} />;
  }

  return <DashboardDemo onBackHome={() => setView("home")} />;
}
