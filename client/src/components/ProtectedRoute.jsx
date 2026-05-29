// components/ProtectedRoute.jsx
// A route guard that prevents unauthenticated users from accessing private pages.
//
// HOW IT WORKS:
// This component wraps any route that requires authentication.
// If the user is logged in → render the page normally.
// If not logged in → redirect to /login.
//
// In App.jsx, usage looks like:
//   <Route element={<ProtectedRoute />}>
//     <Route path="/dashboard" element={<Dashboard />} />
//   </Route>

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = () => {
  // Get authentication status from our global auth context
  const { isAuthenticated } = useAuth();

  // If authenticated: render <Outlet /> which renders the child route's component.
  // If NOT authenticated: redirect to /login.
  // The 'replace' prop replaces the current history entry so the user
  // can't click "back" to return to the protected page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
