/// for Vite environment declarations like import.meta.env
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_PROVIDER: "firebase" | "backend"; // 'firebase' or 'backend'
  // more env variables...
}

