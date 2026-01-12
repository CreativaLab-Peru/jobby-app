import MercadoPagoConfig from "mercadopago";
export const BASE_URL = process.env.NEXT_PUBLIC_URL!;
export const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

export const mercadopago = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
