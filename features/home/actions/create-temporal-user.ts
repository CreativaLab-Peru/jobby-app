"use server"

import {prisma} from "@/lib/prisma";
import {TemporalUser} from "@prisma/client";

interface CreateTemporalUser {
  email: string;
  name?: string;
  newEvaluationId?: string;
}

export const createTemporalUser = async (body: CreateTemporalUser) => {
  const {email, name, newEvaluationId} = body;
  try {
    const existingEmail = await prisma.user.findFirst({
      where: {email}
    })
    if (existingEmail) {
      return {
        success: false,
        error: 'Ya existe un usuario con este correo.',
      }
    }

    let user: TemporalUser | null;
    user = await prisma.temporalUser.findFirst({
      where: {email, name}
    })
    if (!user) {
      user = await prisma.temporalUser.create({
        data: {email, name}
      })
    }

    if (newEvaluationId) {
      const newEvaluation = await prisma.tempCvWithEvaluation.findFirst({
        where: {
          id: newEvaluationId,
        }
      })
      if (!newEvaluation) {
        return {
          success: false,
          error: 'Evaluación no encontrada.',
        }
      }
      await prisma.tempCvWithEvaluation.update({
        where: {id: newEvaluationId},
        data: {
          tempUserId: user.id,
        }
      })
    }

    return {
      success: true,
      temporalUserId: user.id,
    }
  } catch (error) {
    console.error("[ERROR_SEND_EMAIL_TO_PAY]", error);
    return {
      success: false,
      error: 'Internal server error',
    }
  }
}
