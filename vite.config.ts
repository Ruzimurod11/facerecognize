import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      port: 3000,

      proxy: { "/api": "http://217.114.4.62:30300" },
   },
});
