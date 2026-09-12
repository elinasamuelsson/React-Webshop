import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
			"/api/inventory/stockItems": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/inventory\/stockItems/, "/stockItems"),
			},
			"/api/inventory/stockMovements": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/inventory\/stockMovements/, "/stockMovements"),
			},
		},
	},
});
