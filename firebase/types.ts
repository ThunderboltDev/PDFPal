import type { User as FirebaseUser } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export type User = FirebaseUser;

export type UserData = {
  uid: string;
  email: string | null;
  displayName: string;
  avatar: string | null;
  isAnonymous: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
};
