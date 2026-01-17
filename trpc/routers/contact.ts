import { TRPCError } from "@trpc/server";
import axios from "axios";
import { marked } from "marked";
import nodemailer from "nodemailer";
import z from "zod";
import { config } from "@/config";
import { createRateLimit, publicProcedure, router } from "@/trpc/trpc";

export const runtime = "node";

export const contactRouter = router({
  sendMessage: publicProcedure
    .use(
      createRateLimit(
        3,
        60 * 60,
        "send-message",
        "You can only submit this form 3 times per day!"
      )
    )
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
        "https://hcaptcha.com/siteverify",
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

      const { JSDOM } = await import("jsdom");
      const window = new JSDOM("").window;

      const DOMPurify = (await import("dompurify")).default;
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
