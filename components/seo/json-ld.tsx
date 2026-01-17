import Script from "next/script";
import type { Thing, WithContext } from "schema-dts";

interface JsonLdProps<T extends Thing> {
  data: WithContext<T>;
  id?: string;
}

export function JsonLd<T extends Thing>({ data, id }: JsonLdProps<T>) {
  return (
    <Script
      id={id || "json-ld"}
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: json-ld
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
}
