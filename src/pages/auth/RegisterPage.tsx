import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authRepository } from "../../repositories/authRepository";
import { useLanguage } from "../../i18n/useLanguage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { tx } = useLanguage();
  if (authRepository.isAuthenticated()) return <Navigate to="/" replace />;
  return <main className="login-page"><form className="login-form register-form" onSubmit={async (event) => {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const result = await authRepository.register({ nombres: String(form.get("nombres")), apellido_paterno: String(form.get("apellido_paterno")), apellido_materno: String(form.get("apellido_materno")), email: String(form.get("email")), password: String(form.get("password")) });
    if (!result.user) { setError(tx(result.error === "duplicate" ? "Ya existe una cuenta con ese correo." : "Completa los campos con un correo válido.")); return; }
    navigate("/mi-cuenta", { replace: true });
  }}>
    <div className="login-form__brand" aria-hidden="true"><span>TS</span><div><strong>TURISMO</strong><small>SUCRE</small></div></div>
    <div className="login-form__heading"><p>{tx("Cuenta personal")}</p><h1>{tx("Crear cuenta")}</h1><span>{tx("Regístrate para acceder como usuario.")}</span></div>
    {[ ["nombres", "Nombres", "text"], ["apellido_paterno", "Apellido paterno", "text"], ["apellido_materno", "Apellido materno", "text"], ["email", "Correo electrónico", "email"], ["password", "Contraseña", "password"] ].map(([name,label,type]) => <label className="login-form__field" key={name}><span>{tx(label)}</span><input name={name} type={type} required autoComplete={name === "password" ? "new-password" : name === "email" ? "email" : "given-name"} minLength={name === "password" ? 8 : undefined} /></label>)}
    {error && <p className="login-form__error" role="alert">{error}</p>}
    <button className="login-form__submit" type="submit">{tx("Registrarme")}</button>
    <div className="auth-links"><Link to="/login">{tx("Ya tengo una cuenta: iniciar sesión")}</Link><Link to="/">{tx("Continuar como invitado")}</Link></div>
  </form></main>;
}
