import {
  deleteUser,
  GoogleAuthProvider,
  linkWithPopup,
  reauthenticateWithPopup,
  User,
} from "firebase/auth";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "./types";

export const deleteAccount = async (user: User) => {
  if (!user) return;
  try {
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(user, provider);
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
  } catch (err) {
    console.error("Error deleting account:", err);
  }
};

export const linkAccount = async (user: User, userData: UserData) => {
  if (!user) return;
  try {
    const provider = new GoogleAuthProvider();
    const result = await linkWithPopup(user, provider);

    const avatar = userData.avatar ?? result.user.photoURL;
    console.log("user data old avatar:", userData.avatar);
    console.log("new linked user photoURL:", result.user.photoURL);
    console.log("new user avatar:", avatar);

    await updateDoc(doc(db, "users", user.uid), {
      isAnonymous: false,
      avatar: avatar,
      email: result.user.email,
    });
  } catch (err) {
    console.error("Error linking account:", err);
  }
};
