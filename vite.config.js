import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ArquitecturadeSoftware_Vargas/', // ← nombre exacto de tu repositorio
  plugins: [react()],
});