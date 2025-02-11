/**
 * This declaration file allows TypeScript to recognize `.vue` files that do not use `lang="ts"`.
 *
 * Without this, TypeScript will throw errors when importing non-TypeScript Vue components
 * into TypeScript files. This provides a generic type fallback, so the project can
 * gradually migrate to TypeScript without breaking imports.
 *
 * Once a `.vue` component is converted to `lang="ts"`, TypeScript will infer its types properly
 * and no longer rely on this declaration.
 */

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

// __APP_VERSION__ is set as a global variable in vite.config.js
declare const __APP_VERSION__: string; // Allows using __APP_VERSION__ globally
