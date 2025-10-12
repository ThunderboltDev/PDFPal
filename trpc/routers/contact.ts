import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import axios from "axios";
import z from "zod";

import { router, publicProcedure, createRateLimit } from "@/trpc/trpc";
import config from "@/config";

export const contactRouter = router({
  sendMessage: publicProcedure
    .use(createRateLimit(1, 60 * 60, "send-message"))
    .input(
      z.object({
        name: z.string().min(3).max(50),
        email: z.email(),
        userId: z.string().nullable(),
        message: z.string().min(10).max(1000),
        captchaToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const verifyResponse = await axios.post(
        `https://hcaptcha.com/siteverify`,
        {
          secret:
            process.env.NEXT_PUBLIC_ENV === "development"
              ? "0x0000000000000000000000000000000000000000"
              : process.env.HCAPTCHA_SECRET,
          response: input.captchaToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (!verifyResponse.data.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "CAPTCHA verification failed",
        });
      }

      const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);
      const window = new JSDOM("").window;
      const purify = DOMPurify(window);

      await transporter.sendMail({
        from: `"${input.name}" <${input.email}>`,
        to: config.socials.email,
        subject: `New contact message from ${input.name}`,
        html: `<p><strong>Name:</strong> ${input.name}</p>
               <p><strong>User ID</strong>: ${input.userId}</p>
               <p><strong>Email:</strong> ${input.email}</p>
               <p><strong>Message:</strong><br/>${purify.sanitize(
                 marked.parse(input.message) as string
               )}</p>`,
      });

      return { success: true };
    }),
});
