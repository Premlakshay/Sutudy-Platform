/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        swcMinify: true,
    }
};
export default nextConfig;
