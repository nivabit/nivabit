import { form, query, command, getRequestEvent } from '$app/server';
import { error, invalid } from '@sveltejs/kit';
import * as v from 'valibot';
import mjml2html from 'mjml';
import { desc, eq } from 'drizzle-orm';
import { db, newsletterSubscribers } from '#lib/server/db/index.ts';
import { requireUser } from '#lib/server/auth.ts';
import { checkSubmissionSpam } from '#lib/server/antiSpam.ts';
import { validateEmail } from '#lib/server/emailValidator.ts';
import { sendMail } from '#lib/server/mailer.ts';
import { subscribeNewsletterSchema, sendNewsletterSchema } from '#lib/validation/validation.ts';

function subscriptionTemplate(email: string) {
	return `
    <div style="max-width:600px;margin:auto;font-family:sans-serif;line-height:1.6;color:#111111;padding:24px;">
      <h2 style="color:#111111;margin-bottom:12px;">Welcome to The Validation Memo</h2>
      <p>Hi there,</p>
      <p>Thank you for subscribing with <strong>${email}</strong>. Every Tuesday, you'll receive private market research breakdowns, untapped product opportunity teardowns, and data-backed validation frameworks for founders.</p>
      <p>We analyze real market signals so you never waste runway building something nobody wants.</p>
      <p style="margin-top:24px;">To your breakthrough,<br/><strong>The Nivabit Research Team</strong></p>
      <hr style="border:none;border-top:1px solid #e5e5e0;margin:24px 0;"/>
      <p style="font-size:12px;color:#787872;">&copy; ${new Date().getFullYear()} Nivabit Research. All rights reserved.</p>
    </div>
  `;
}

export const subscribeNewsletter = form(
	subscribeNewsletterSchema,
	async ({ email, website, _startedAt }, issue) => {
		const event = getRequestEvent();
		const spam = checkSubmissionSpam(event, {
			scope: 'newsletter',
			email,
			honeypot: website,
			startedAt: _startedAt
		});

		if (spam.blocked) {
			if (spam.silentDrop) {
				return { success: true, message: 'Successfully subscribed!' };
			}
			return invalid(issue.email(spam.reason || 'Too many attempts. Please try again later.'));
		}

		const check = await validateEmail(email);
	if (!check.valid) {
		return invalid(issue.email(check.error || 'Invalid email address'));
	}

	const [exists] = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.email, email))
		.limit(1);
	if (exists) {
		return invalid(issue.email('This email is already subscribed to The Validation Memo.'));
	}

	const [subscriber] = await db
		.insert(newsletterSubscribers)
		.values({ email })
		.returning();

	await sendMail({
		to: subscriber.email,
		subject: 'Welcome to The Validation Memo',
		text: 'Thank you for subscribing to The Validation Memo by Nivabit!',
		html: subscriptionTemplate(subscriber.email)
	});

	return { success: true, message: 'Successfully subscribed!' };
});

export const getSubscribers = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
});

export const sendNewsletter = form(sendNewsletterSchema, async ({ subject, message }) => {
	const event = getRequestEvent();
	await requireUser(event);

	const { html, errors } = mjml2html(message, { validationLevel: 'soft' });
	if (errors && errors.length) {
		console.warn('MJML validation warnings:', errors);
	}

	const subscribers = await db.select().from(newsletterSubscribers);
	if (subscribers.length === 0) {
		return invalid('No subscribers found to send to.');
	}

	await Promise.all(
		subscribers.map((sub) =>
			sendMail({
				to: sub.email,
				subject,
				text: 'This email requires an HTML viewer',
				html
			})
		)
	);

	return { success: true, message: 'Newsletter sent to all subscribers.' };
});

const deleteSubscriberSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty('Subscriber ID is required'))
});

export const deleteSubscriber = command(deleteSubscriberSchema, async ({ id }) => {
	const event = getRequestEvent();
	await requireUser(event);

	const [subscriber] = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.id, id))
		.limit(1);
	if (!subscriber) {
		throw error(404, 'Subscriber not found');
	}

	await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
	await getSubscribers().refresh();

	return { success: true, message: 'Subscriber removed successfully.' };
});

export const unsubscribeNewsletter = form(subscribeNewsletterSchema, async ({ email }, issue) => {
	const check = await validateEmail(email);
	if (!check.valid) {
		return invalid(issue.email(check.error || 'Invalid email address'));
	}

	const [subscriber] = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.email, email))
		.limit(1);
	if (!subscriber) {
		return invalid(issue.email('Email not found in our subscriber list.'));
	}

	await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
	return { success: true, message: 'Successfully unsubscribed.' };
});
