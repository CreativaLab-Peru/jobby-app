import {UKRoadmapJsonLd} from "./json-ld";

export function SellingLayoutView({children}: { children: React.ReactNode }) {
  return (
    <>
      <UKRoadmapJsonLd/>
      <main className="flex-1">{children}</main>
    </>
  );
}
