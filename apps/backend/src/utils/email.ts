import { resend } from "../lib/resend";
import { env } from "../config/env";

export const sendOtpEmail = async (
  email: string,
  otp: string,
  type: "verify" | "reset" = "verify"
) => {
  const isReset = type === "reset";

  await resend.emails.send({
    from: `Codiva <noreply@${env.APP_DOMAIN}>`,
    to: email,
    subject: isReset ? "Reset your Codiva password" : "Verify your Codiva account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h2 style="font-size: 24px; font-weight: 700; color: #09090b; margin-bottom: 8px;">
          ${isReset ? "Reset your password" : "Verify your email"}
        </h2>
        <p style="color: #71717a; font-size: 15px; margin-bottom: 32px;">
          ${isReset
            ? "Use this code to reset your Codiva password. It expires in 5 minutes."
            : "Enter this code to verify your account. It expires in 5 minutes."}
        </p>
        <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 0.2em; color: #09090b; font-family: monospace;">
            ${otp}
          </span>
        </div>
        <p style="color: #a1a1aa; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};