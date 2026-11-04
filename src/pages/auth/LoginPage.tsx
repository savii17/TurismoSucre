import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials } from "../../types/auth";
import { useLanguage } from "../../i18n/useLanguage";

export default function LoginPage({ role = "USUARIO" }: { role?: "ADMIN" | "USUARIO" }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { tx } = useLanguage();
  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");
    try {
      const user = await authRepository.login(credentials, role);
      if (!user) { setError(tx(role === "ADMIN" ? "Credenciales inválidas o cuenta sin permisos de administrador." : "Correo o contraseña incorrectos.")); return; }
      navigate(role === "ADMIN" ? "/administrador" : "/", { replace: true });
    } catch { setError(tx("No se pudo verificar la contraseña en este navegador.")); }
  };
  return <main className="login-page"><div className="auth-card-wrap"><LoginForm error={error} onSubmit={handleLogin} title={role === "ADMIN" ? "Acceso de administrador" : "Acceso de usuario"} />
    <nav className="auth-links" aria-label={tx("Opciones de acceso")}>
      {role === "USUARIO" ? <><Link to="/registro">{tx("Registrarse")}</Link><Link to="/admin/login">{tx("Acceso administrativo")}</Link></> : <Link to="/login">{tx("Acceso de usuario")}</Link>}
      <Link to="/">{tx("Continuar como invitado")}</Link>
    </nav></div></main>;
}
