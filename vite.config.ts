import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
    "process.env": {
      ODDS_API_KEY: "76873652c65271f478f9fc077e2fe144",
    },
  },
});
