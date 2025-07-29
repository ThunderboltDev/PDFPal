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
import type { Form } from "@/firebase/types";

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

export async function createNewForm(userId: string, form: Partial<Form>) {
  const formRef = doc(formsCollection);
  const userRef = doc(db, "users", userId);

  const now = Timestamp.now();

  const newForm: Partial<Form> = {
    ...form,
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
}

export async function updateForm(form: Form) {
  const newForm: Form = {
    ...form,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(doc(db, "forms", form.id), newForm);
}

export async function deleteFormById(formId: string, userId: string) {
  const formRef = doc(db, "forms", formId);
  const userRef = doc(db, "users", userId);

  const batch = writeBatch(db);
  batch.delete(formRef);
  batch.update(userRef, { formsCreated: increment(-1) });
  await batch.commit();
}
