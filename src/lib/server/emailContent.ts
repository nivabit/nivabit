import type { contactType } from './email';

const CONTACT_MESSAGE_FIELDS: { [key: string]: string } = {
	name: 'Name',
	services: 'Services',
	email: 'Email',
	subject: 'Subject',
	message: 'Message'
};

export const generateEmailContent = (data: contactType) => {
	const stringData = Object.entries(data).reduce(
		(str, [key, val]) => (str += `${CONTACT_MESSAGE_FIELDS[key] ?? key}: \n${val} \n\n`),
		''
	);

  const htmlData = Object.entries(data).reduce((str, [key, val]) => {
    return (str += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">
          ${CONTACT_MESSAGE_FIELDS[key]}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;">
          ${key === "services" ? val.toString() : val}
        </td>
      </tr>
    `);
  }, '');

  return {
    text: stringData,
    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <h2 style="color: #333; margin: 0;">📬 New Contact Form Submission</h2>
                  <p style="color: #888; margin-top: 8px; font-size: 14px;">You've received a new message via your website</p>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    ${htmlData}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 30px; text-align: center; color: #999; font-size: 12px;">
                  This message was sent from your website contact form.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`,
  };
};













