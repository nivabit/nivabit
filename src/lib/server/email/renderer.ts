import Handlebars from 'handlebars';

// Register helpful Handlebars helpers
Handlebars.registerHelper('year', () => new Date().getFullYear());

const templates: Record<string, HandlebarsTemplateDelegate> = {};

// Source templates
const templateSources: Record<string, string> = {
	'booking-confirmation': `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Strategy Call is Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background-color:#090d14;padding:32px 36px;text-align:left;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <span style="display:inline-block;width:10px;height:10px;background-color:#2563eb;border-radius:2px;"></span>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:'Segoe UI',sans-serif;font-size:16px;font-weight:900;letter-spacing:1px;color:#ffffff;">NIVABIT</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:20px 0 0 0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                Strategy Call Confirmed
              </h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:#94a3b8;">
                14-Day Validation &amp; Architecture Roadmap
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:36px;">
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#1e293b;">
                Hi <strong>{{firstName}}</strong>,
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#475569;">
                Thank you for scheduling a strategy call with Nivabit. We have reserved your 15-minute product validation session.
              </p>

              <!-- Meeting Details Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom:12px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">
                          Date &amp; Time
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:16px;font-weight:700;color:#2563eb;padding-bottom:16px;">
                          {{formattedDate}} at {{timeSlot}} ({{timezone}})
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #e2e8f0;padding-top:14px;">
                          Contact Phone
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#1e293b;">
                          {{phone}}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What We Will Cover -->
              <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;">
                What We Will Cover:
              </h3>
              <ul style="margin:0 0 28px 0;padding-left:20px;font-size:14px;line-height:1.7;color:#475569;">
                <li>Unpack your core product hypothesis and identify high-risk assumptions.</li>
                <li>Design pre-code customer willingness-to-pay experiments.</li>
                <li>Walk through the 14-day validation dossier timeline and scope.</li>
              </ul>

              <!-- WhatsApp Quick Action -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/2349066809821?text=Hi%20Nivabit,%20I%20just%20booked%20a%20call%20for%20{{formattedDate}}%20at%20{{timeSlot}}" target="_blank" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:10px;box-shadow:0 2px 8px rgba(37, 99, 235,0.25);">
                      Message Us on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0 0;font-size:13px;line-height:1.6;color:#64748b;text-align:center;">
                Need to reschedule? Simply reply directly to this email or reach us on WhatsApp.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 36px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                &copy; {{year}} Nivabit Studio. We innovate the bit. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
	'booking-admin-notification': `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Strategy Call Booked</title>
</head>
<body style="background-color:#f8fafc;font-family:sans-serif;color:#0f172a;padding:24px;">
  <div style="max-width:540px;margin:auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:28px;">
    <h2 style="margin:0 0 8px 0;color:#2563eb;">⚡ New Strategy Call Booked</h2>
    <p style="margin:0 0 20px 0;color:#64748b;font-size:14px;">A new founder has booked an intro strategy call.</p>
    
    <table style="width:100%;font-size:14px;line-height:1.8;border-collapse:collapse;">
      <tr>
        <td style="color:#64748b;width:120px;font-weight:bold;">Name:</td>
        <td style="color:#0f172a;font-weight:bold;">{{firstName}} {{lastName}}</td>
      </tr>
      <tr>
        <td style="color:#64748b;font-weight:bold;">Email:</td>
        <td><a href="mailto:{{email}}" style="color:#2563eb;">{{email}}</a></td>
      </tr>
      <tr>
        <td style="color:#64748b;font-weight:bold;">Phone:</td>
        <td><a href="tel:{{phone}}" style="color:#2563eb;">{{phone}}</a></td>
      </tr>
      <tr>
        <td style="color:#64748b;font-weight:bold;">Date:</td>
        <td style="font-weight:bold;">{{formattedDate}}</td>
      </tr>
      <tr>
        <td style="color:#64748b;font-weight:bold;">Time Slot:</td>
        <td style="font-weight:bold;color:#2563eb;">{{timeSlot}} ({{timezone}})</td>
      </tr>
      {{#if notes}}
      <tr>
        <td style="color:#64748b;font-weight:bold;vertical-align:top;">Notes / Brief:</td>
        <td style="background:#f1f5f9;padding:8px;border-radius:6px;">{{notes}}</td>
      </tr>
      {{/if}}
    </table>

    <div style="margin-top:24px;text-align:center;">
      <a href="https://wa.me/{{cleanPhone}}" style="background:#2563eb;color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:8px;font-size:13px;font-weight:bold;display:inline-block;">
        WhatsApp Contact
      </a>
    </div>
  </div>
</body>
</html>
`,
	'newsletter-welcome': `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to The Validation Memo</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
          <tr>
            <td style="background-color:#090d14;padding:32px 36px;">
              <span style="display:inline-block;width:10px;height:10px;background-color:#2563eb;border-radius:2px;margin-right:8px;vertical-align:middle;"></span>
              <span style="font-size:16px;font-weight:900;letter-spacing:1px;color:#ffffff;vertical-align:middle;">NIVABIT</span>
              <h1 style="margin:20px 0 0 0;font-size:22px;color:#ffffff;font-weight:800;">Welcome to The Validation Memo</h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:#94a3b8;">Issue Zero • Pre-Code Dossier Inside</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px;">
              <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 18px 0;">
                You're officially on the list with <strong>{{email}}</strong>.
              </p>
              <p style="font-size:15px;line-height:1.6;color:#334155;margin:0 0 24px 0;">
                Every Tuesday, we break down untapped product opportunities, customer willingness-to-pay teardowns, and actionable validation frameworks so you never burn runway on features nobody wants.
              </p>
              <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:28px;">
                <p style="margin:0;font-size:13px;font-weight:bold;color:#0f172a;">Your Welcome Deliverable:</p>
                <p style="margin:4px 0 0 0;font-size:13px;color:#475569;">The 14-Day Software Validation Framework + Pre-Code Buyer Discovery Checklist.</p>
              </div>
              <div style="text-align:center;">
                <a href="https://nivabit.com/#system" style="background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 24px;border-radius:8px;display:inline-block;">
                  Explore The Framework
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;">
              &copy; {{year}} Nivabit Studio. We innovate the bit.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
};

export function renderEmailTemplate(
	templateName: keyof typeof templateSources,
	context: Record<string, any>
): string {
	if (!templates[templateName]) {
		const source = templateSources[templateName];
		if (!source) {
			throw new Error(`Email template "${templateName}" not found.`);
		}
		templates[templateName] = Handlebars.compile(source);
	}

	return templates[templateName]({
		year: new Date().getFullYear(),
		...context
	});
}
