import { Navigate } from "react-router-dom";
import SidebarLayout from "./SidebarLayout";
import { authRepository } from "../../repositories/authRepository";

export default function PublicExperienceLayout() {
  const user = authRepository.getCurrentUser();
  if (user?.estado === "ACTIVO" && user.rol === "ADMIN") return <Navigate to="/administrador" replace />;
  return <SidebarLayout />;
}
