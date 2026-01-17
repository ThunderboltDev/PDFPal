import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = pgEnum("SubscriptionStatus", [
  "PAID",
  "ACTIVE",
  "CANCELLED",
  "EXPIRED",
  "UNPAID",
]);

export const authProviderEnum = pgEnum("AuthProvider", ["GOOGLE", "GITHUB"]);

export const uploadStatusEnum = pgEnum("UploadStatus", [
  "PROCESSING",
  "SUCCESS",
  "FAILED_TOO_LARGE",
  "FAILED_TOO_MANY_PAGES",
  "FAILED_UNKNOWN",
]);

export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").default("You").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  customerId: text("customerId"),
  subscriptionId: text("subscriptionId"),
  currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => usersTable.id),
  timezone: text("timezone"),
  country: text("country"),
  city: text("city"),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
});

export const accountsTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => usersTable.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verificationsTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const filesTable = pgTable("File", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  uploadStatus: uploadStatusEnum("uploadStatus")
    .default("PROCESSING")
    .notNull(),
  key: text("key").notNull().unique(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  userId: text("userId").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});

export const messagesTable = pgTable("Message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  text: text("text").notNull(),
  isUserMessage: boolean("isUserMessage").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: text("userId").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  fileId: text("fileId").references(() => filesTable.id, {
    onDelete: "cascade",
  }),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  sessions: many(sessionsTable),
  files: many(filesTable),
  messages: many(messagesTable),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const filesRelations = relations(filesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [filesTable.userId],
    references: [usersTable.id],
  }),
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [messagesTable.userId],
    references: [usersTable.id],
  }),
  file: one(filesTable, {
    fields: [messagesTable.fileId],
    references: [filesTable.id],
  }),
}));

export const schema = {
  user: usersTable,
  session: sessionsTable,
  account: accountsTable,
  message: messagesTable,
  file: filesTable,
  verification: verificationsTable,
  usersRelations,
  accountsRelations,
};
