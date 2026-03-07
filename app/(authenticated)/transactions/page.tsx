import { getUserTransactions } from "@/features/credits/actions/get-user-transactions";
import { MyTransactionsScreen } from "@/features/credits/screens/my-transactions-screen";
import { TransactionType, CreditBalanceType } from "@prisma/client";

interface TransactionsPageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
    creditType?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const type = params.type as TransactionType | undefined;
  const creditType = params.creditType as CreditBalanceType | undefined;
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;

  const result = await getUserTransactions(skip, pageSize, {
    type: type || null,
    creditType: creditType || null,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  });

  const transactions = result.success ? result.data.transactions : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { success: false; error: string }).error;

  return (
    <MyTransactionsScreen
      transactions={transactions}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialType={type || ""}
      initialCreditType={creditType || ""}
      initialDateFrom={dateFrom || ""}
      initialDateTo={dateTo || ""}
      initialError={error}
    />
  );
}

