import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Proxy API requests to Vercel dev server (when running locally)
  // Frontend runs on port 3000, backend API on port 3001
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VERCEL_DEV_URL || "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        // Only proxy in development
        configure: (proxy, _options) => {
          proxy.on("error", (_err, _req, _res) => {
            console.log(
              "⚠️  Vercel dev server not running. API calls will fail."
            );
            console.log(
              "💡 Run: npm run dev (starts both frontend and backend)"
            );
          });
        },
      },
    },
  },
  build: {
    // Optimize build output
    rollupOptions: {
      output: {
        // Code splitting: Separate vendor chunks
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "auth-vendor": ["@auth0/auth0-react"],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query", "framer-motion"],
  },
});
