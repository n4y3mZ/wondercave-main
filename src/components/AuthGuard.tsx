import { Navigate, Outlet } from "react-router-dom";

export default function AuthGuard({ children }: { children?: React.ReactNode }) {
  const token = localStorage.getItem("sc_token");
  const expiry = localStorage.getItem("sc_token_expiry");

  if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
    localStorage.removeItem("sc_token");
    localStorage.removeItem("sc_token_expiry");
    localStorage.removeItem("sc_user");
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
