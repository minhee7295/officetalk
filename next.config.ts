import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    // @review 이미지 불러오는 외부아이피들이 다름 이유는??
    domains: ["rrsfdiuiearbxyntkcxh.supabase.co", "picsum.photos"],
  },
};

export default nextConfig;
