import { createRequire } from 'node:module';
import bookingConfirmation from './templates/booking-confirmation.hbs?raw';
import bookingAdminNotification from './templates/booking-admin-notification.hbs?raw';
import newsletterWelcome from './templates/newsletter-welcome.hbs?raw';

const require = createRequire(import.meta.url);
const Handlebars = require('handlebars');

// Register global Handlebars helpers
Handlebars.registerHelper('year', () => new Date().getFullYear());

/**
 * Sources for all email templates loaded from dedicated .hbs files in ./templates/
 */
export const templateSources = {
	'booking-confirmation': bookingConfirmation,
	'booking-admin-notification': bookingAdminNotification,
	'newsletter-welcome': newsletterWelcome
} as const;

export type EmailTemplateName = keyof typeof templateSources;

const compiledTemplates: Record<string, (context: any) => string> = {};

/**
 * Compiles and renders an email template with context data
 */
export function renderEmailTemplate(
	templateName: EmailTemplateName | (string & {}),
	context: Record<string, any> = {}
): string {
	if (!compiledTemplates[templateName]) {
		const source = (templateSources as Record<string, string>)[templateName];
		if (!source) {
			throw new Error(`Email template "${templateName}" not found in templates directory.`);
		}
		compiledTemplates[templateName] = Handlebars.compile(source);
	}

	return compiledTemplates[templateName]({
		year: new Date().getFullYear(),
		...context
	});
}
