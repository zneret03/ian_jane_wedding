/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — deploy the ./out folder to Netlify, GitHub Pages, S3, anywhere.
  // Remove `output` if you deploy to Vercel and want server rendering.
  output: 'export',
  images: {
    // Required for `output: 'export'` — Next's image optimizer needs a server.
    unoptimized: true,
  },
  // Deploying to GitHub Pages at https://<user>.github.io/ian_jane_wedding ?
  // Uncomment both lines below.
  // basePath: '/ian_jane_wedding',
  // assetPrefix: '/ian_jane_wedding/',
};

export default nextConfig;
