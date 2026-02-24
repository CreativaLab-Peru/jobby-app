import OpportunitiesScreen from "@/features/opportunities/screens/opportunites-screen";
import {getOpportunities, paginationParams} from "@/features/opportunities/get-opportunities";
import {getAllCvForCurrentUser} from "@/features/cv/actions/get-all-cv-for-current-user";

type OpportunitiesPageProps = {
  searchParams?: Promise<{
    cvId?: string;
  }>
}

export default async function OpportunitiesPage({
                                                   searchParams
                                                 }: OpportunitiesPageProps) {
  const { cvId } = searchParams ? await searchParams : {};

  const params: paginationParams = {
    skip: 0,
    take: 6,
    cvId: cvId || undefined
  }

  const [data, cvData] = await Promise.all([
    getOpportunities(params),
    getAllCvForCurrentUser(0, 50),
  ]);

  const hasMore = data ? data.hasMore : false;
  const initialCvs = cvData.cvs;

  return (
    <OpportunitiesScreen
      initialCvs={initialCvs}
      initialData={data?.opportunities || []}
      hasMoreProp={hasMore}
      totalCount={data?.totalCount || 0}
      currentFilterCvId={cvId || null}
    />
  );
}
