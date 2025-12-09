import { Resend } from "resend";

export default async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {

    const resend = new Resend(process.env.RESEND_API_KEY);

    resend.emails.send({
        from: 'keepnet-support@resend.dev',
        to: to,
        subject: subject,
        html: `<p>${text}</p>`
    })
    console.log(`Sending email to ${to} with subject "${subject}" and body: ${text}`);
}