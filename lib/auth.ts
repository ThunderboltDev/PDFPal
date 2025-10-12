import axios from "axios";
import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { cookies } from "next/headers";
import { Adapter } from "@auth/core/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { createTransport } from "nodemailer";

import { db } from "@/lib/db";

type GeoResponse = {
  status: "success" | "fail";
  timezone?: string;
  country?: string;
  city?: string;
};

function CustomAdapter() {
  const prisma = PrismaAdapter(db);

  return {
    ...prisma,
    async updateUser(data) {
      if ("emailVerified" in data) delete data.emailVerified;
      return prisma.updateUser!(data);
    },
    async createVerificationToken(verificationToken) {
      const { identifier, token, expires } = verificationToken;

      return await db.verificationToken.upsert({
        where: {
          identifier_token: { identifier, token },
        },
        update: {
          token,
          expires,
        },
        create: {
          identifier,
          token,
          expires,
        },
      });
    },
  } as Adapter;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: CustomAdapter(),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Email({
      maxAge: 60 * 60,
      from: process.env.EMAIL_FROM,
      server: process.env.EMAIL_SERVER,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);

        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Verify your email: ${host}`,
          text: text({ url, host }),
          html: html(url),
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);

        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ email, profile, user }) {
      if (email?.verificationRequest) return true;
      if (!user.email) return false;

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        await db.user.update({
          where: { email: user.email },
          data: {
            lastLogin: new Date(),
          },
        });
      } else {
        await db.user.create({
          data: {
            id: user.id,
            name: user.name ?? profile?.name,
            email: user.email,
            image: user.image ?? (profile?.image as string | undefined),
            lastLogin: new Date(),
          },
        });
      }

      return true;
    },
    async session({ session }) {
      const cookieStore = await cookies();

      const userAgent = cookieStore.get("client-ua")?.value || null;
      const ipAddress = cookieStore.get("client-ip")?.value || null;

      const sessionRecord = await db.session.findUnique({
        where: { sessionToken: session.sessionToken },
      });

      if (!sessionRecord) return session;

      if (sessionRecord.userAgent !== userAgent) {
        await db.session.updateMany({
          where: {
            sessionToken: session.sessionToken,
          },
          data: {
            userAgent,
          },
        });
      }

      if (
        Date.now() - new Date(sessionRecord.lastActivity).getTime() >
        10 * 60_000
      ) {
        await db.session.updateMany({
          where: {
            sessionToken: session.sessionToken,
          },
          data: {
            lastActivity: new Date(),
          },
        });
      }

      if (ipAddress) {
        const fields = "country,city,timezone,status";
        const url = `http://ip-api.com/json/${ipAddress}?fields=${fields}`;

        try {
          const response = await axios.get(url);
          const data: GeoResponse = response.data;

          if (data && data.status === "success") {
            await db.session.updateMany({
              where: {
                sessionToken: session.sessionToken,
              },
              data: {
                timezone: data.timezone,
                country: data.country,
                city: data.city,
              },
            });
          }
        } catch (error) {
          console.error("Unable to use ip geolocation:", error);
        }
      }

      return session;
    },
  },
  pages: {
    newUser: "/dashboard",
    signIn: "/auth",
    signOut: "/logout",
    error: "/auth",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
});

function text({ url, host }: { url: string; host: string }) {
  return `Verify your email: ${host}\n${url}\n\n`;
}

function html(url: string) {
  const brandColor = "#2b7fff";

  const fontFamily = "Arial, Helvetica, sans-serif";

  const color = {
    background: "#ffffff",
    text: "#101010",
    secondaryText: "#404040",
    mutedText: "#707070",
    buttonText: "#fafafa",
    buttonBorder: brandColor,
    buttonBackground: brandColor,
  };

  return `
<body style="background: ${color.background}; font-family: ${fontFamily};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td 
        align="center"
        style="padding: 10px 0px; font-size: 20px; color: ${color.text};"
      >
        Verify your email!
      </td>
    </tr>
    <tr>
      <td
        align="center"
        style="padding: 8px 0px; font-size: 16px; color: ${color.secondaryText};"
      >
        Click the button below to verify your email
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <a href="${url}"
                target="_blank"
                style="font-size: 15px; color: ${color.buttonText}; text-decoration: none; border-radius: 12px; padding: 8px 20px; display: inline-block;"
              >
                Verify Email
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 12px; line-height: 16px; color: ${color.mutedText};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}
