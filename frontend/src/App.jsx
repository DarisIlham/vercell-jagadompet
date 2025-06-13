import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import WelcomeinPage from "./pages/WelcomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ViewPage from "./pages/view.jsx";
import SignPage from "./pages/SignPage.jsx";
import LogoutPage from "./pages/LogOut.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import EditPage from "./pages/EditPage.jsx";
import HistoryPage from "./pages/HistroyPage.jsx";
import InputPage from "./pages/InputIn.jsx";
import InputexPage from "./pages/InputEx.jsx";
import ListPage from "./pages/List.jsx";
import React, { useEffect, useState } from "react";
import { apiClient } from "../src/utils/apiClient.jsx";

function NetworkAwareRoutes() {
  const [slowNetwork, setSlowNetwork] = useState(false);
  const [error, setError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { error: err, slowNetwork: isSlow } = await apiClient(
        "/api/auth",
         // "http://localhost:5000/wrong-url",
        { method: "GET" },
        1000
      );

      if (!isMounted) return;

      if (!navigator.onLine) {
        setError(true);
        setSlowNetwork(false);
        return;
      }

      if (isSlow) {
        setSlowNetwork(true);
        setError(false);
        setTimeout(() => {
          if (isMounted) setSlowNetwork(false);
        }, 3000);
        return;
      }

      if (err) {
        setError(true);
        setSlowNetwork(false);
        return;
      }

      setError(false);
      setSlowNetwork(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]); // 🔁 Detect on every route change

  return (
    <>
      {/* Slow network overlay */}
      {slowNetwork && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#00C153] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#00C153] font-semibold">Loading...</p>
            <p className="text-gray-600 text-sm text-center max-w-xs">
              Slow network detected. Please wait while the content is being
              loaded.
            </p>
          </div>
        </div>
      )}

      {/* Offline or fetch error */}
      {error && !slowNetwork && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#FA2F34] text-white py-2 text-center z-50">
          🚫 You appear to be offline or the server is unreachable.
        </div>
      )}

      {/* All your routes */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<WelcomeinPage />} />
        <Route path="/dash" element={<DashboardPage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/sign" element={<SignPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/incinput" element={<InputPage />} />
        <Route path="/expinput" element={<InputexPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="h-fit font-inter">
        <NetworkAwareRoutes />
      </div>
    </Router>
  );
}

export default App;
