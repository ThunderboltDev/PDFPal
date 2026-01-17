import type { InferSelectModel } from "drizzle-orm";
import type {
  accountsTable,
  filesTable,
  messagesTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from "@/db/schema";

export type User = InferSelectModel<typeof usersTable>;
export type Account = InferSelectModel<typeof accountsTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type Verification = InferSelectModel<typeof verificationsTable>;
export type File = InferSelectModel<typeof filesTable>;
export type Message = InferSelectModel<typeof messagesTable>;
