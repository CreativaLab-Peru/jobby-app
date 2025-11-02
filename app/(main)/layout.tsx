import type { Metadata } from 'next'
import { getUser } from "@/lib/shared/get-user";
import { TermsModal } from "@/components/terms-modal";
import '../globals.css';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { getLimitPlanOfCurrentUser } from '@/lib/shared/get-count-availables-attempts';

export const metadata: Metadata = {
    title: 'Jobby - Tu talento merece ser visible',
    description: 'Jobby potenciado con inteligencia artificial',
    authors: [{ name: 'Jobby' }],
    openGraph: {
        title: 'Jobby - CV inteligente para creativos',
        description: 'Transforma tu talento en un CV ganador. Optimizado con IA para jóvenes profesionales creativos.',
        type: 'website',
        images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@jobby_ai',
        images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
    },
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode,
}>) {
    const limitPlanOfCurrentUser = await getLimitPlanOfCurrentUser();
    const user = await getUser()
    const isTermsAccepted = user?.acceptedTermsAndConditions && user?.acceptedPrivacyPolicy || false;

    const needsNewPayment =
        limitPlanOfCurrentUser.cvCreations.total === limitPlanOfCurrentUser.cvCreations.used
        || limitPlanOfCurrentUser.scoreAnalysis.total === limitPlanOfCurrentUser.scoreAnalysis.used

    return (
        <>
            <div className="flex min-h-screen relative w-full">
                <div className="flex-1 flex flex-col">
                    <NavbarWrapper
                        hasSubscription={needsNewPayment}
                        userLimit={limitPlanOfCurrentUser}
                        user={user} />
                    <main className="flex-1 transition-all duration-300">{children}</main>
                    <TermsModal isOpen={!isTermsAccepted} userId={user?.id} />
                </div>
            </div>
        </>
    )
}
