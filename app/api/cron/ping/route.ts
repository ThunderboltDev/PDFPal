import { db } from "@/db";
import { usersTable } from "@/db/schema";

export async function GET() {
  await db.select().from(usersTable).limit(1);

  return new Response("OK");
}
