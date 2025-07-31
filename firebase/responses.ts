import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FormResponse } from "./types";

export async function submitResponse(
  formId: string,
  responseData: FormResponse
): Promise<string> {
  const responsesRef = collection(db, "forms", formId, "responses");
  const docRef = await addDoc(responsesRef, {
    ...responseData,
    submittedAt: new Date(),
  });

  return docRef.id;
}
