"use server"

import { prisma } from "@/lib/prisma";

import { Preference } from "mercadopago";
import { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types";
import { BASE_URL, mercadopago } from "@/lib/mercado-preference";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { PAYMEMT_PLAN_ID_BY_DIRECT } from "../shared/consts";


export const createPreferenceForAuthenticatedUser = async () => {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        success: false,
        error: 'No se ha encontrado el usuario',
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
            unit_price: 9.90,
            quantity: 1,
            title: directPayment.name || 'sin-titulo',
            currency_id: 'PEN',
          },
        ],
        metadata: {
          id: directPayment.id,
          userId: currentUser.id,
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
    console.error("[MERCADOPAGO][CREATE_PREFERENCE][ERROR]", error)
    return {
      success: false,
      error: 'Ha ocurrido un error al procesar tu solicitud',
      raw: error,
    }
  }
}