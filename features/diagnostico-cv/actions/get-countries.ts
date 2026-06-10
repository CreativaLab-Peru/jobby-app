"use server";

import { prisma } from "@/lib/prisma";

export interface CountryOption {
  id: string;
  name: string;
  code: string; // "GB" | "US" | "DE" | "FR" | "JP"
  flag: string;
}

export async function getCountriesAction(): Promise<CountryOption[]> {
  const countries = await prisma.country.findMany({
    select: { id: true, name: true, code: true, flag: true },
    orderBy: { name: "asc" },
  });
  return countries;
}
