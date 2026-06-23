import { useState } from "react";
import { MentoriaStep, MentoriaRequestData } from "../types/mentoria";

export function useMentoriaFlow() {
  const [step, setStep] = useState<MentoriaStep>("landing");
  const [userData, setUserData] = useState<Partial<MentoriaRequestData>>({});

  const setUserInfo = (data: MentoriaRequestData) => setUserData(data);

  return { step, setStep, userData, setUserInfo };
}
