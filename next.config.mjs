/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: "/redirects/nouns.build/dao/:chain/:token",
                destination: "https://nouns.build/dao/:chain/:token",
                permanent: false,
            },
            {
               source: "/redirects/:route*",
               destination: "https://:route*",
               permanent: false,
            },
        ];
      },
};

export default nextConfig;
