import { Paddle, Environment } from "@paddle/paddle-node-sdk";

export const BASE_URL = process.env.NEXT_PUBLIC_URL!;

const apiKey = process.env.PADDLE_API_KEY!;
const isLiveKey = apiKey?.includes("live");

export const paddle = new Paddle(apiKey, {
  environment: isLiveKey ? Environment.production : Environment.sandbox,
});
