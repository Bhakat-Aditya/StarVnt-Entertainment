
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VendorProfile from "./pages/VendorProfile.jsx";
import Inquiries from "./pages/Inquiries.jsx";

const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        {}
        {}
        <Route path="/login" element={<Login />} />

        {}
        {}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<VendorProfile />} />
            <Route path="/inquiries" element={<Inquiries />} />
          </Route>
        </Route>

        {}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
