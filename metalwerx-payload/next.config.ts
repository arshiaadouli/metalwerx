import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // The CMS has no pages of its own, only the admin and the API.
  async redirects() {
    return [{ source: '/', destination: '/admin', permanent: false }]
  },
  // Let the dev server's live reload work when the admin is opened from
  // another device on the LAN, e.g. http://192.168.15.240:3001/admin.
  allowedDevOrigins: ['192.168.*.*'],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
