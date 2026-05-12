import {ProfileButton} from "@/components/profile-button";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

interface DashboardCompanyProps {
  params: Promise<{
    companyName: string;
  }>,
}

export default async function DashboardCompany({params}: DashboardCompanyProps) {
  const {companyName} = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div className="text-5xl text-red-500">
      No user found
    </div>
  }

  return (
    <div>
      <div className="text-5xl text-primary">
        PRIMARY
      </div>
      <div className="text-3xl text-secundary">
        SECONDARY
      </div>
      <ProfileButton
        redirectUrl={`/c/${companyName}/login`}
        user={{
          email: currentUser.email,
          name: currentUser.name,
          image: currentUser.image,
          id: currentUser.id,
        }}/>
    </div>
  )
}
