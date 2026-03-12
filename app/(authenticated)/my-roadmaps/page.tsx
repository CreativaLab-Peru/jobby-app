import { getRoadmapsForUser } from "@/features/roadmap/actions/get-roadmaps-for-user";
import MyRoadmapsScreen from "@/features/roadmap/components/my-roadmaps-screen";

export default async function MyRoadmapsPage() {
  const data = await getRoadmapsForUser({ skip: 0, take: 10 });

  return (
    <MyRoadmapsScreen
      initialData={data?.roadmaps ?? []}
      hasMoreProp={data?.hasMore ?? false}
      totalCount={data?.totalCount ?? 0}
    />
  );
}

