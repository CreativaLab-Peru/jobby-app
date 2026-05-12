import {ProfileButton} from "@/components/profile-button";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export default async function DashboardCompany() {
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
        redirectUrl={"/c/mujeres-digitales/login"}
        user={{
          email: currentUser.email,
          name: currentUser.name,
          image: currentUser.image,
          id: currentUser.id,
        }}/>
    </div>
  )
}
