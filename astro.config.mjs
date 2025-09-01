// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // Para desarrollo local usar 'static', para producción 'server'
  output: process.env.NODE_ENV === 'production' ? 'server' : 'static',
  adapter: process.env.NODE_ENV === 'production' ? netlify() : undefined,
  
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  
  // Configure server for subdomain handling in development
  server: {
    host: '0.0.0.0',  // Permitir conexiones externas
    port: 4321
  }
});