import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

export default async function OFirstPage(){
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/')
  }
  const member = await prisma.companyMember.findFirst({
    where: {
      userId: currentUser.id,
      status: "ACTIVE",
    },
    include: {company: {include: {preference: true}}},
  });
  if (!member) {
    redirect('/dashboard')
  } else {
    redirect(`/c/${member.companyId}/dashboard`);
  }
}
