import {notFound} from "next/navigation";
import WelcomeMasterEmail from "@/features/authentication/templates/welcome-master";

export default function TestPage() {
  const isDebug = process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true";
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev && !isDebug) {
    notFound();
  }

  return <WelcomeMasterEmail userName={"onichan"} />;
}
