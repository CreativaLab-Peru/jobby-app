import {MetadataRoute} from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://joinlevely.com'

  // Definimos las rutas de ventas manualmente por ahora
  // O podrías recuperarlas de una constante de "features"
  const sellingRoutes = [
    {
      url: `${baseUrl}/uk`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const, // Cambia seguido por el contador de bonos
      priority: 0.9, // Alta prioridad, es tu core de ventas
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...sellingRoutes,
  ]
}
