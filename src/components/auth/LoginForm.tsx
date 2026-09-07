import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";
import { useLanguage } from "../../i18n/useLanguage";


interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}


function LoginForm({ error, onSubmit }: LoginFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

  const normalizedEmail = email.trim();


     if (!normalizedEmail || !password) {
      return;
    }



    onSubmit({
      email: normalizedEmail,
      password,
    });
  };


  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__brand" aria-hidden="true">
        <span>TS</span>
        <div><strong>TURISMO</strong><small>SUCRE</small></div>
      </div>

      <div className="login-form__heading">
        <p>Panel de gestión turística</p>
        <h1>{t("signIn")}</h1>
        <span>Ingresa tus credenciales para continuar.</span>
      </div>


      <div className="login-form__field">
         <label htmlFor="email">{t("email")}</label>


        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("emailPlaceholder")}
          autoComplete="username"
          required
        />
      </div>


      <div className="login-form__field">
        <label htmlFor="password">{t("password")}</label>


        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          required
        />
      </div>


      {error && (
        <p className="login-form__error" role="alert" aria-live="polite">
          {error}
        </p>
      )}


      <button className="login-form__submit" type="submit">{t("login")}</button>
    </form>
  );
}


export default LoginForm;
