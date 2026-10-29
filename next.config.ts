import type { NextConfig } from "next";
const nextConfig: NextConfig = { output: "export", images: { unoptimized: true }, typescript: { tsconfigPath: "tsconfig.site.json" } };
export default nextConfig;
