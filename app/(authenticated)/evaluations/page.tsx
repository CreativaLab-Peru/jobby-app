import { ScoresListPage } from "@/features/analysis/components/score-list";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {
  EvaluationFilterOptions,
  geEvaluationsForCurrentUser
} from "@/features/cv/actions/get-evaluations-for-current-user";
import {getAllCvForCurrentUser} from "@/features/cv/actions/get-all-cv-for-current-user";

type MyEvaluationsPageProps = {
  searchParams?: Promise<{
    cvId?: string;
  }>
}

export default async function MyEvaluationsPage({
                                                  searchParams
                                                }:MyEvaluationsPageProps) {
  const { cvId } = searchParams ? await searchParams : {};

  const params: EvaluationFilterOptions = {
    skip: 0,
    take: 5,
    onlySuccessful: true,
    cvId
  }

  const [cvEvaluations, creditLimits, cvData] = await Promise.all([
    geEvaluationsForCurrentUser(params),
    getCurrentCreditLimits(),
    getAllCvForCurrentUser(0, 50),
  ]);

  const initialCvs = cvData.cvs;

  const evaluations = cvEvaluations?.evaluations ?? [];

  const canAnalyze = (creditLimits?.aiActionsLimit ?? 0) > 0;

  const hasMore = cvEvaluations?.hasMore ?? false;
  const totalCount = cvEvaluations?.totalCount ?? 0;

  return (
    <ScoresListPage
      initialEvaluations={evaluations}
      initialCvs={initialCvs}
      canAnalyze={canAnalyze}
      hasMoreProp={hasMore}
      totalCount={totalCount}
      currentFilters={{
        cvId: cvId || null,
        justSuccessful: true,
      }}
    />
  );
}
