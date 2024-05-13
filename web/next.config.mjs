/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async () => {
      return [
        {
          source: "/superrare/:path*",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*", // Set your origin
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization",
            },
          ],
        },
      ];
    },
    redirects: async () => {
      return [
        {
          source: "/auction/:slug",
          destination: "/nounish-auction/v0/:slug",
          permanent: false,
        },
        {
            source: "/carousel/:slug",
            destination: "/carousel/:slug/0",
            permanent: false,
        }
      ];
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },      
    logging: {
      fetches: {
          fullUrl: true
      },
    },
    experimental: {
      serverComponentsExternalPackages: ["@resvg/resvg-js"],
    },
};

export default nextConfig;
