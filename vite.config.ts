import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        icon: true,
        typescript: true,
        prettier: true,
        svgo: true,
      },
      // Removed broken esbuildOptions.jsxImportSource "@emotion/react" — emotion is not used
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png", "icons/*.png"],
      manifest: {
        name: "GigHub — Hire & Get Hired",
        short_name: "GigHub",
        description:
          "GigHub connects job seekers with employers. Find your next gig or hire top talent.",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["business", "productivity"],
        shortcuts: [
          {
            name: "Find Jobs",
            short_name: "Jobs",
            description: "Browse available jobs",
            url: "/applicant/find-jobs",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Post a Job",
            short_name: "Post Job",
            description: "Post a new job listing",
            url: "/employer/dashboard",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        // Cache strategy for the app shell
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        runtimeCaching: [
          {
            // Network-first for API calls so data is always fresh
            urlPattern: /^https?:\/\/.*\/api\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Cache-first for Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache external avatar images
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "avatar-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  server: {
    host: true,
  },

  build: {
    // Sourcemaps disabled in production for smaller bundle
    sourcemap: false,
    // Warn when chunks exceed 800kB
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manually split large vendors into separate chunks for better caching
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // React core
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router-dom/") ||
              id.includes("/react-router/") ||
              id.includes("/scheduler/")
            ) {
              return "vendor-react";
            }
            // Redux / state
            if (
              id.includes("/@reduxjs/") ||
              id.includes("/react-redux/") ||
              id.includes("/zustand/") ||
              id.includes("/immer/")
            ) {
              return "vendor-state";
            }
            // Ant Design (huge)
            if (id.includes("/antd/") || id.includes("/rc-")) {
              return "vendor-antd";
            }
            // Framer Motion
            if (id.includes("/framer-motion/")) {
              return "vendor-motion";
            }
            // UI libraries
            if (
              id.includes("/@headlessui/") ||
              id.includes("/@heroicons/") ||
              id.includes("/lucide-react/") ||
              id.includes("/react-icons/")
            ) {
              return "vendor-ui";
            }
            // Utilities
            if (
              id.includes("/lodash") ||
              id.includes("/date-fns/") ||
              id.includes("/axios/") ||
              id.includes("/zod/") ||
              id.includes("/numeral/")
            ) {
              return "vendor-utils";
            }
            // Tanstack Query
            if (id.includes("/@tanstack/")) {
              return "vendor-query";
            }
            // Socket.io
            if (id.includes("/socket.io")) {
              return "vendor-socket";
            }
            // All other node_modules
            return "vendor";
          }
        },
      },
    },
  },
});
