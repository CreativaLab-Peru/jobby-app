"use server"

import {Preference} from "mercadopago";
import {PreferenceCreateData} from "mercadopago/dist/clients/preference/create/types";
import {BASE_URL, mercadopago} from "@/features/billing/domain/mercado-preference";
import {prisma} from "@/lib/prisma";

export const createDiagnosticoPreference = async (email: string, name: string) => {
  try {
    if (!BASE_URL) {
      throw new Error("Critical: BASE_URL is not defined in environment variables");
    }

    const DIAGNOSTICO_PRICE = 19.90;
    const DIAGNOSTICO_TITLE = "Diagnostico Levely - Pago unico";

    // Create or find temporal user
    let temporalUser = await prisma.temporalUser.findUnique({
      where: {email: email.toLowerCase()},
    });

    if (!temporalUser) {
      temporalUser = await prisma.temporalUser.create({
        data: {
          email: email.toLowerCase(),
          name,
        },
      });
    }

    const body: PreferenceCreateData = {
      body: {
        statement_descriptor: "Levely",
        items: [
          {
            id: "diagnostico-cv",
            unit_price: DIAGNOSTICO_PRICE,
            quantity: 1,
            title: DIAGNOSTICO_TITLE,
            currency_id: "PEN",
          },
        ],
        metadata: {
          type: "DIAGNOSTICO",
          email: email.toLowerCase(),
          name,
          temporalUserId: temporalUser.id,
        },
        external_reference: temporalUser.id,
        back_urls: {
          success: `${BASE_URL}/diagnostico-cv?payment=success`,
          failure: `${BASE_URL}/diagnostico-cv?payment=failure`,
          pending: `${BASE_URL}/diagnostico-cv?payment=pending`,
        },
      },
    };

    const preference = await new Preference(mercadopago).create(body);
    return {
      success: true,
      redirect: preference.init_point!,
    };
  } catch (error) {
    console.error("[ERROR_CREATE_DIAGNOSTICO_PREFERENCE]", error);
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud",
      raw: error,
    };
  }
};
