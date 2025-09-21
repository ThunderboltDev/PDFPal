import { router, contactProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import config from "@/config";
import axios from "axios";
import z from "zod";

export const contactRouter = router({
  sendMessage: contactProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        email: z.email(),
        message: z.string().min(10).max(250),
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

      await transporter.sendMail({
        from: `"${input.name}" <${input.email}>`,
        to: config.socials.email,
        subject: `New contact message from ${input.name}`,
        html: `<p><strong>Name:</strong> ${input.name}</p>
               <p><strong>Email:</strong> ${input.email}</p>
               <p><strong>Message:</strong><br/>${input.message}</p>`,
      });

      return { success: true };
    }),
});
