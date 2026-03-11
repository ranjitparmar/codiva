export const constants = {
    OTP_LENGTH: 6,
    OTP_MAX_ATTEMPTS: 3,
    OTP_RESEND_SECONDS: 60,
    OTP_EXPIRES_SECONDS: 300,
    OTP_MAIL_FROM: "Codiva <noreply@codiva.ranjitparmar.in>",
    OTP_MAIL_SUBJECT: "Your Codiva Verification Code",

    DEFAULT_CREDITS:5,
    DAILY_CREDITS:1,

    CREDITS_STANDARD:1,
    CREDITS_PRO:5,

    BCRYPT_ROUNDS:10
} as const