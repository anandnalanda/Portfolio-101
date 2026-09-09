/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Both are re-export barrels imported by name (24 icons from one line in
    // StapleChatScreen). lucide-react is optimized by Next out of the box;
    // these two are not.
    optimizePackageImports: ["@untitledui/icons", "react-aria-components"],
  },
};
export default nextConfig;
