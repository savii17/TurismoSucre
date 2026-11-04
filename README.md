# React + TypeScript + Vite

## Acceso local de TurismoSucre

- La navegación turística y las páginas de consulta son públicas para invitados.
- El acceso de usuario está en `/login`; el registro abierto está en `/registro` y siempre asigna el rol `USUARIO`.
- El acceso administrativo independiente está en `/admin/login`. La cuenta de demostración existente se mantiene en `src/data/users.json` (`admin@example.com` / `admin123`); cámbiala antes de cualquier demostración compartida.
- La sesión y las cuentas creadas se conservan en `localStorage` en el mismo navegador/dispositivo. Las contraseñas nuevas se guardan como hash PBKDF2 con salt mediante Web Crypto; las cuentas de prueba antiguas se mantienen intactas y siguen usando el formato heredado del archivo JSON.

**Limitación de seguridad:** este proyecto no tiene backend. Los roles, rutas y registros locales solo ayudan a probar los flujos en el navegador. Una persona con acceso al dispositivo puede inspeccionar o modificar el almacenamiento y los archivos publicados; por eso esta autenticación no ofrece seguridad real para producción ni protege datos sensibles. La validación definitiva de credenciales y permisos requiere un servidor.

### Interfaces por tipo de acceso

- Invitado: entra en `/` y conserva el layout público original.
- Usuario registrado: inicia sesión en `/login`; llega a `/mi-cuenta`, con navegación propia, `/mi-cuenta/favoritos` y `/mi-cuenta/notificaciones`.
- Administrador: inicia sesión en `/admin/login`; usa el panel `/administrador` y rutas de gestión `/admin/...`.
- Las cuentas creadas por registro siempre reciben rol `USUARIO`. El cliente contrasta el rol de sesión con el registro de cuenta antes de habilitar operaciones administrativas. Como toda esta implementación es local, una persona que manipule todo el estado del navegador aún puede suplantar sesiones; no debe usarse como control de acceso de producción.
- Los catálogos de hospedajes, restaurantes, entretenimiento y eventos se guardan en `localStorage` al modificarlos y se comparten con sus páginas públicas. Los lugares turísticos mantienen el repositorio persistente existente. Favoritos, notificaciones y visitas también son locales a este navegador.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
