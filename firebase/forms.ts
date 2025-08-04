import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
  getDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

import { db, formsCollection } from "@/lib/firebase";
import type { Form, LocalForm } from "@/firebase/types";

export async function fetchFormById(formId: string): Promise<Form | null> {
  const docRef = doc(db, "forms", formId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Form;
}

export async function fetchFormsByUserId(
  userId: string
): Promise<Form[] | null> {
  const q = query(collection(db, "forms"), where("createdBy", "==", userId));
  const snapshot = await getDocs(q);
  if (!snapshot) return null;
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Form[];
}

export async function publishForm(
  form: LocalForm,
  userId: string
): Promise<string> {
  const formRef = doc(formsCollection);
  const userRef = doc(db, "users", userId);

  const now = Timestamp.now();

  const newForm: Form = {
    ...form,
    id: formRef.id,
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  };

  const batch = writeBatch(db);

  batch.set(formRef, newForm);
  batch.update(userRef, {
    formsCreated: increment(1),
  });

  await batch.commit();

  return formRef.id;
}

export async function updateForm(form: Form) {
  const newForm: Form = {
    ...form,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(doc(db, "forms", form.id), newForm);
}

export async function deleteFormById(formId: string, userId: string) {
  const userRef = doc(db, "users", userId);
  const formRef = doc(db, "forms", formId);
  const responsesRef = collection(db, "forms", formId, "responses");

  console.log("formref path: ", formRef.path);

  const responsesSnap = await getDocs(responsesRef);
  const batch = writeBatch(db);

  responsesSnap.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(formRef);
  batch.update(userRef, { formsCreated: increment(-1) });

  await batch.commit();
}
