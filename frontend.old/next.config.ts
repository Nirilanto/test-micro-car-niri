/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Supprimez swcMinify ou mettez-le à true si votre version le supporte
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:3007/:path*`, // Assurez-vous d'avoir le http:// ou https://
      },
    ];
  },
};

module.exports = nextConfig;