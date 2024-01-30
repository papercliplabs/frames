/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
          {
            source: "/redirects/:route",
            destination: "https://:route",
            permanent: false,
          },
        ];
      },
};

export default nextConfig;
