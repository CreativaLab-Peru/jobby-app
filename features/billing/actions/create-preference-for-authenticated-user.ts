"use server"

import { prisma } from "@/lib/prisma";

import { Preference } from "mercadopago";
import { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import {BASE_URL, mercadopago} from "@/features/billing/domain/mercado-preference";


export const createPreferenceForAuthenticatedUser = async (slug: string) => {
  try {
    console.log("BASE_URL:", BASE_URL);
    if (!BASE_URL) {
      throw new Error("Critical: BASE_URL is not defined in environment variables");
    }

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

    const price = Number(paymentPlan.priceCentsPEN) || 0;
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
            currency_id: "PEN",
          },
        ],
        metadata: {
          id: paymentPlan.id,
          userId: currentUser.id,
          type: paymentPlan.paymentType,
        },
        external_reference: paymentPlan.id,
        // redirect_urls: {
        //   success: `${BASE_URL}/cv?payment=success`,
        //   failure: `${BASE_URL}/cv?payment=failure`,
        //   pending: `${BASE_URL}/cv?payment=pending`,
        // },
        back_urls: {
          success: `${BASE_URL}/cv?payment=success`,
          failure: `${BASE_URL}/cv?payment=failure`,
          pending: `${BASE_URL}/cv?payment=pending`,
        },
        auto_return: "approved", // Redirección automática

        // Evita que el usuario pueda pagar con métodos que no quieres (opcional)
        payment_methods: {
          excluded_payment_types: [
            { id: "ticket" } // Excluye pagos en efectivo si quieres inmediatez
          ],
          installments: 1 // Limita a 1 cuota si no quieres manejar intereses
        }
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
