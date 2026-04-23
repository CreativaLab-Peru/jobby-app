import {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',       // Evitar que bots rastreen tus server actions expuestos
        '/_next/',     // Archivos internos de Next.js
        '/admin/',     // Panel de administración (si existiera)
      ],
    },
    sitemap: 'https://joinlevely.com/sitemap.xml',
  }
}
