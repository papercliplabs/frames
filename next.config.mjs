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
            {
               source: "/based-dao/auction",
               destination: "/auction/based-dao",
               permanent: false,
            },
            {
                source: "/lil-nouns/auction",
                destination: "/auction/lil-nouns",
                permanent: false,
            }, 
            {
                source: "/based-management/auction",
                destination: "/auction/based-management",
                permanent: false,
            }, 
            {
                source: "/builder-dao/auction",
                destination: "/auction/builder-dao",
                permanent: false,
            }, 
            {
                source: "/nouns/auction",
                destination: "/auction/nouns",
                permanent: false,
            }, 
            {
                source: "/purple/auction",
                destination: "/auction/purple-dao",
                permanent: false,
            }, 
            {
                source: "/yellow-collective/auction",
                destination: "/auction/yellow-collective",
                permanent: false,
            }, 
            {
                source: "/api/nouns-auction",
                destination: "/auction/nouns",
                permanent: false,
            }, 
        ];
      },
};

export default nextConfig;
