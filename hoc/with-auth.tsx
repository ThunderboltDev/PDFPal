import { ComponentType } from "react";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { User } from "@prisma/client";
import { db } from "@/lib/db";

export type PropsWithDbUser<ExtraProps = object> = ExtraProps & {
  dbUser: User;
};

export type PropsWithNullableDbUser<ExtraProps = object> = ExtraProps & {
  dbUser: User | null;
};

export type PropsWithoutDbUser<T> = Omit<T, "dbUser">;

export default function withAuth<T extends object>(
  WrappedComponent: ComponentType<T & { dbUser: User }>,
  options?: {
    allowUnauthenticated?: false;
    origin?: string;
  }
): ComponentType<PropsWithoutDbUser<T & { dbUser: User }>>;

export default function withAuth<T extends object>(
  WrappedComponent: ComponentType<T & { dbUser: User | null }>,
  options?: {
    allowUnauthenticated: true;
    origin?: string;
  }
): ComponentType<PropsWithoutDbUser<T & { dbUser: User | null }>>;

export default function withAuth<T extends { dbUser: User }>(
  WrappedComponent: ComponentType<T>,
  options?: { allowUnauthenticated?: boolean; origin?: string }
) {
  const allowUnauthenticated = !!options?.allowUnauthenticated;
  const origin = options?.origin ?? "/dashboard";

  async function AuthenticatedWrapper(props: PropsWithoutDbUser<T>) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      if (allowUnauthenticated) <WrappedComponent {...(props as T)} />;
      redirect(`/auth-callback?origin=${origin}`);
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) redirect(`/auth-callback?origin=${origin}`);

    return (
      <WrappedComponent
        {...(props as T)}
        dbUser={dbUser}
      />
    );
  }

  AuthenticatedWrapper.displayName = `withAuth(${
    WrappedComponent.displayName || "Component"
  })`;

  return AuthenticatedWrapper;
}
