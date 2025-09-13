import { createTransport } from "nodemailer";

import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 15 * 60,
      async sendVerificationRequest(params) {
        const { identifier, url, provider } = params;
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
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, email }) {
      if (!user.email) return "Email is not provided";
      if (email?.verificationRequest) return true;

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (existingUser) {
        if (!account) return "Account cannot be found!";
        const linked = existingUser.accounts.find(
          (acc) => acc.provider === account?.provider
        );

        if (!linked) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refreshToken: account.refresh_token,
              accessToken: account.access_token,
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,

              tokenType: account.token_type,
              idToken: account.id_token,
              scope: account.scope,
              sessionState: account.session_state,
            },
          });
        }
      } else {
        await db.user.create({
          data: {
            id: user.id,
            displayName: user.name,
            avatarUrl: user.image,
            email: user.email,
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      try {
        if (user?.id) token.id = user.id;
        return token;
      } catch (err) {
        console.error("jwt callback error:", err, { token, user });
        return token;
      }
    },
    async session({ session, token, user }) {
      try {
        if (!session?.user) return session;

        const userId = token?.id ?? token?.sub ?? user?.id;
        if (userId) session.user.id = String(userId);

        return session;
      } catch (error) {
        console.error("session callback error:", error, {
          session,
          token,
          user,
        });
        return session;
      }
    },
  },
  pages: {
    signOut: "/logout",
    signIn: "/auth",
    error: "/auth",
  },
  session: { strategy: "jwt" },
};

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
