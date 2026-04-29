import CheveningLandingScreen from "@/features/onboarding/screens/chevening-landing-screen";

interface SellingScholarshipScreenProps {
  beca?: string;
}

export default function SellingScholarshipScreen({
  beca
                                                 }: SellingScholarshipScreenProps) {
  return (
    <div className="min-h-screen flex flex-col gap-6 p-4">
      <CheveningLandingScreen/>
    </div>
  );
}
