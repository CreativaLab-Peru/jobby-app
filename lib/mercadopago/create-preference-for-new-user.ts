"use server"

import {prisma} from "@/lib/prisma";

import {Preference} from "mercadopago";
import {PreferenceCreateData} from "mercadopago/dist/clients/preference/create/types";
import {BASE_URL, mercadopago} from "@/lib/mercado-preference";
import {PAYMEMT_PLAN_ID_BY_DIRECT} from "../shared/consts";

export const createPreferenceForNewUser = async (id: string) => {
  try {
    const currentUser = await prisma.temporalUser.findFirst({
      where: {
        id,
      }
    })
    if (!currentUser) {
      return {
        success: false,
        error: 'No se ha encontrado el usuario temporal',
      }
    }

    const directPayment = await prisma.paymentPlan.findFirst({
      where: {
        id: PAYMEMT_PLAN_ID_BY_DIRECT,
      },
    })
    if (!directPayment) {
      return {
        success: false,
        error: 'No se ha encontrado el plan de pago',
      }
    }

    const body: PreferenceCreateData = {
      body: {
        items: [
          {
            id: directPayment.id,
            unit_price: Number(directPayment.priceCents) || 9.90,
            quantity: 1,
            title: 'Jobby pro',
            currency_id: 'PEN',
          },
        ],
        metadata: {
          id: directPayment.id,
          email: currentUser.email,
          type: directPayment.paymentType,
        },
        external_reference: directPayment.id,
        redirect_urls: {
          success: `${BASE_URL}/cv?payment=success`,
          failure: `${BASE_URL}/cv?payment=failure`,
        }
      },
    }

    const preference = await new Preference(mercadopago).create(body)

    return {
      success: true,
      redirect: preference.init_point!
    }
  } catch (error) {
    console.error("[ERROR_CREATE_PREFERENCE_FOR_NEW_USER", error)
    return {
      success: false,
      error: 'Ha ocurrido un error al procesar tu solicitud',
      raw: error,
    }
  }
}
