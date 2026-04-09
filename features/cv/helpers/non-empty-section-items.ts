import type { CVData } from "@/types/cv";

type ProjectItem = NonNullable<NonNullable<CVData["projects"]>["items"]>[number];
type CertificationItem = NonNullable<NonNullable<CVData["certifications"]>["items"]>[number];
type VolunteeringItem = NonNullable<NonNullable<CVData["volunteering"]>["items"]>[number];
type ComplementsItem = NonNullable<NonNullable<CVData["complements"]>["items"]>[number];
type InterestsItem = NonNullable<NonNullable<CVData["interests"]>["items"]>[number];

const hasText = (value: string | null): boolean => value !== null && value.trim().length > 0;

export const getNonEmptyProjectItems = (items: ProjectItem[] | null): ProjectItem[] =>
  (items ?? []).filter((item) =>
    [item.title, item.description, item.technologies, item.duration].some((value) => hasText(value ?? null))
  );

export const getNonEmptyCertificationItems = (
  items: CertificationItem[] | null,
): CertificationItem[] =>
  (items ?? []).filter((item) =>
    [item.name, item.issuer, item.date].some((value) => hasText(value ?? null))
  );

export const getNonEmptyVolunteeringItems = (items: VolunteeringItem[] | null): VolunteeringItem[] =>
  (items ?? []).filter((item) =>
    [item.organization, item.location, item.position, item.duration, item.responsibilities].some((value) =>
      hasText(value ?? null)
    )
  );

export const getNonEmptyComplementsItems = (items: ComplementsItem[] | null): ComplementsItem[] =>
  (items ?? []).filter((item) =>
    [item.title, item.description, item.content].some((value) => hasText(value ?? null))
  );

export const normalizeComplementsItems = (
  source: ComplementsItem[] | ComplementsItem | null | undefined,
): ComplementsItem[] => {
  const items = Array.isArray(source) ? source : source ? [source] : [];
  return getNonEmptyComplementsItems(items);
};

export const getNonEmptyInterestsItems = (items: InterestsItem[] | null): InterestsItem[] =>
  (items ?? []).filter((item) =>
    [item.title, item.description, item.content].some((value) => hasText(value ?? null))
  );
