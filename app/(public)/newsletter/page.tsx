import { Newsletter } from "@/features/newletter/screens/new-letter-screen";
import { PublicPageTransition } from "@/components/shared/public-page-transition";

export default function NewLetterPage() {
  return (
    <PublicPageTransition>
      <Newsletter />
    </PublicPageTransition>
  );
}
