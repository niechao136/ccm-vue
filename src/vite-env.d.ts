/// <reference types="vite/client" />

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_HOMEPAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
