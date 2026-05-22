import { getJsonLd } from "@/lib/seo";

export function JsonLd() {
  const data = getJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
