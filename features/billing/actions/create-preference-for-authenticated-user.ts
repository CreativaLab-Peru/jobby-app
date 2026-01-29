"use server"

import { prisma } from "@/lib/prisma";

import { Preference } from "mercadopago";
import { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import {BASE_URL, mercadopago} from "@/features/billing/domain/mercado-preference";

export const createPreferenceForAuthenticatedUser = async (slug: string) => {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        success: false,
        error: 'No se ha encontrado el usuario',
      }
    }

    const paymentPlan = await prisma.paymentPlan.findFirst({
      where: {
        slug: slug.toLowerCase(),
      },
    })
    if (!paymentPlan) {
      return {
        success: false,
        error: 'No se ha encontrado el plan de pago',
      }
    }

    const price = Number(paymentPlan.priceCents) || 0;
    if (price <= 0) {
      return {
        success: false,
        error: 'El precio del plan de pago no es válido',
      }
    }

    const body: PreferenceCreateData = {
      body: {
        items: [
          {
            id: paymentPlan.id,
            unit_price: price,
            quantity: 1,
            title: paymentPlan.name || 'sin-titulo',
            currency_id: paymentPlan.currency,
          },
        ],
        metadata: {
          id: paymentPlan.id,
          userId: currentUser.id,
          type: paymentPlan.paymentType,
        },
        external_reference: paymentPlan.id,
        redirect_urls: {
          success: `${BASE_URL}/cv?payment=success`,
          failure: `${BASE_URL}/cv?payment=failure`,
          pending: `${BASE_URL}/cv?payment=pending`,
        },
        // back_urls: {
        //   success: `${BASE_URL}/cv?payment=back-success`,
        //   failure: `${BASE_URL}/cv?payment=back-failure`,
        //   pending: `${BASE_URL}/cv?payment=back-pending`,
        // },
        // auto_return: "approved",
      },
    }

    const preference = await new Preference(mercadopago).create(body)
    return {
      success: true,
      redirect: preference.init_point!
    }
  } catch (error) {
    console.error("[ERROR_CREATE_PREFERENCE_MERCADO_PAGO]", error)
    return {
      success: false,
      error: 'Ha ocurrido un error al procesar tu solicitud',
      raw: error,
    }
  }
}
