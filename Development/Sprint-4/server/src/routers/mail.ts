import { Context, Hono } from "hono";
import sendEmail from "@src/utils/mails/mailer";
const mail = new Hono();

mail.post("/sendTextMail", async (c: Context) => {
  try {
    const { to, subject, text } = await c.req.json();
    const mail = await sendEmail(to, subject, text, "");

    return c.json({ data: mail, error: null });
  } catch (error:any) {
    console.log(error);
    return c.json({ error:error.message, data: null },500);
  }
});

mail.post("/sendHtmlMail", async (c: Context) => {
  try {
    const { to, subject, html } = await c.req.json();
    const mail = await sendEmail(to, subject, "", html);

    return c.json({ data: mail, error: null });
  } catch (error:any) {
    console.log(error);
    return c.json({ error:error.message, data: null },500);
  }
});

export default mail;
