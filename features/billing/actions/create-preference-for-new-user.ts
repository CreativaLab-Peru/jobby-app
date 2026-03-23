"use server"

import {prisma} from "@/lib/prisma";

import {Preference} from "mercadopago";
import {PreferenceCreateData} from "mercadopago/dist/clients/preference/create/types";
import {BASE_URL, mercadopago} from "@/features/billing/domain/mercado-preference";

const PREFERENCE_PLAN = "starter"
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
        slug: PREFERENCE_PLAN
      },
    })
    if (!directPayment) {
      return {
        success: false,
        error: 'No se ha encontrado el plan de pago',
      }
    }

    const priceCents = Number(directPayment.priceCentsPEN) || 0
    const pricePEN = priceCents > 0 ? priceCents / 100 : 9.90

    const body: PreferenceCreateData = {
      body: {
        items: [
          {
            id: directPayment.id,
            unit_price: pricePEN,
            quantity: 1,
            title: directPayment.name,
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
