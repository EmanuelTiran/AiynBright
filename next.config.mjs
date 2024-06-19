/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            hostname: 'www.carpetim.co.il',
           },
         {
            hostname: 'tzemer.co.il',
         },
      ],
   },
};

export default nextConfig;
