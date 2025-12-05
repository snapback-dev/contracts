import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts"],
	format: ["esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	outDir: "dist",
	tsconfig: "tsconfig.json",
	target: "es2022",
});
