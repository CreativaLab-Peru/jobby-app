export function UKRoadmapJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "UK Master Roadmap 2025-26",
    "image": "https://joinlevely.com/roadmap-thumbnail.jpg",
    "description": "Guía completa para candidatos de LATAM aplicando a maestrías de negocios en UK.",
    "brand": {
      "@type": "Brand",
      "name": "Levely"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://joinlevely.com/uk",
      "priceCurrency": "USD",
      "price": "19.00",
      "availability": "https://schema.org/InStock",
      "validThrough": "2026-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
