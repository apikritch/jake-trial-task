import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        signup: resolve(__dirname, "src/signup/index.html"),
        login: resolve(__dirname, "src/login/index.html"),
        user: resolve(__dirname, "src/user/index.html"),
      },
    },
  },
});
