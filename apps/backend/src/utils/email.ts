import { resend } from "../lib/resend";
import { constants } from "../config/constants";

const otpTemplate = (otp: string) => {
    
    const html = `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #111;">Verify your email</h2>
        <p style="color: #555;">Use the code below to complete your signup. Expires in 5 minutes.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #6366f1; padding: 20px 0;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    `

    return html
}

export const sendOtpEmail = async (email: string, otp: string) => {
    await resend.emails.send({
        from: constants.OTP_MAIL_FROM,
        to: email,
        subject: constants.OTP_MAIL_SUBJECT,
        html: otpTemplate(otp)
    })
}
