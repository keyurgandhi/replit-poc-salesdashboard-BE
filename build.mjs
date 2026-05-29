// ... [ Keep your imports at the top exactly as they are ]

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    
    // 1. ADD PINO AND THREAD-STREAM HERE TO KEEP THEM EXTERNAL
    external: [
      "pino",
      "thread-stream",
      "pino-pretty",
      "*.node",
      "sharp",
      // ... [ Keep the rest of your large external list identical ]
    ],
    sourcemap: "linked",
    
    // 2. COMMENT OUT OR REMOVE THE PINO PLUGIN entirely 
    // Since we externalized it above, we don't want the plugin trying to bundle workers anymore.
    plugins: [
      // esbuildPluginPino({ relative: true })
    ],

    // 3. Keep your banner exactly as it is for Express/CJS compatibility
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module'; import __bannerPath from 'node:path'; import __bannerUrl from 'node:url'; globalThis.require = __bannerCrReq(import.meta.url); globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url); globalThis.__dirname = __bannerPath.dirname(globalThis.__filename); `,
    },
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
