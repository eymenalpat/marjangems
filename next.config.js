/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['iktqqglefxvnndmwsfzk.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 