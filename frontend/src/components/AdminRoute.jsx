import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if (!userInfo.admin) {
    toast.error("Admin access only");
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
