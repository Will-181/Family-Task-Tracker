import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev server to be used from other devices on your network (LAN IPs like 192.168.50.153)
  // Next.js compares origins as host or host:port; wildcards supported.
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "192.168.50.153",
    "192.168.50.153:3000",
  ],
};

export default nextConfig;
