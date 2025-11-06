import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
export async function sendMail(opts) {
    // adresse d’expéditeur
    const from = process.env.SMTP_FROM || "No-Reply <no-reply@exemple.com>";
    const info = await transporter.sendMail({
        from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
    });
    // utile en dev
    if (process.env.NODE_ENV !== "production") {
        console.log("[mailer] messageId:", info.messageId);
    }
    return info;
}
