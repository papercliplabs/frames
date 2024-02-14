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
                source: "/redirects/etherscan/:route*",
                destination: "https://etherscan.io/:route*",
                permanent: false,
            },
            {
                source: "/redirects/basescan/:route*",
                destination: "https://basescan.org/:route*",
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
                source: "/yellow/auction",
                destination: "/auction/yellow-collective",
                permanent: false,
            }, 
            {
                source: "/api/nouns-auction",
                destination: "/auction/nouns",
                permanent: false,
            }, 
            {
                source: "/api/nouns-auction/img/home",
                destination: "/images/nouns-auction-house.png",
                permanent: false,
            }, 
            {
                source: "/common/nouns-auction/api",
                has: [
                    {
                      type: "query",
                      key: "dao",
                      value: "yellow",
                    },
                  ],
                destination: "/auction/yellow-collective",
                permanent: false,
            }, 
            {
                source: "/common/nouns-auction/api",
                has: [
                    {
                      type: "query",
                      key: "dao",
                      value: "purple",
                    },
                  ],
                destination: "/auction/purple-dao",
                permanent: false,
            }, 
            {
                source: "/common/nouns-auction/api",
                has: [
                    {
                      type: "query",
                      key: "dao",
                      value: "(?<dao>.*)",
                    },
                  ],
                destination: "/auction/:dao",
                permanent: false,
            }, 
            {
                source: "/carousel/:slug",
                destination: "/carousel/:slug/0",
                permanent: false,
            }
        ];
      },
      logging: {
        fetches: {
            fullUrl: true
        }
      }
};

export default nextConfig;
