import { form, query, command, getRequestEvent } from '$app/server';
import { error, invalid } from '@sveltejs/kit';
import * as v from 'valibot';
import mjml2html from 'mjml';
import { desc, eq, inArray } from 'drizzle-orm';
import { db, newsletterSubscribers, newsletterBroadcasts } from '#lib/server/db/index.ts';
import { requireUser } from '#lib/server/auth.ts';
import { checkSubmissionSpam } from '#lib/server/antiSpam.ts';
import { validateEmail } from '#lib/server/emailValidator.ts';
import { sendMail, sendBulkMail } from '#lib/server/mailer.ts';
import { renderEmailTemplate } from '#lib/server/email/renderer.ts';
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

export const getBroadcastHistory = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	return db
		.select()
		.from(newsletterBroadcasts)
		.orderBy(desc(newsletterBroadcasts.createdAt))
		.limit(10);
});

async function runBroadcastWorker(
	broadcastId: string,
	targets: string[],
	subject: string,
	plainText: string,
	html: string
) {
	try {
		const { sent, failed } = await sendBulkMail({
			recipients: targets,
			subject,
			text: plainText,
			html,
			batchSize: 10,
			onBatchProgress: async (sentSoFar, failedSoFar) => {
				await db
					.update(newsletterBroadcasts)
					.set({ sentCount: sentSoFar, failedCount: failedSoFar })
					.where(eq(newsletterBroadcasts.id, broadcastId));
			}
		});

		await db
			.update(newsletterBroadcasts)
			.set({
				sentCount: sent,
				failedCount: failed,
				status: failed === targets.length && targets.length > 0 ? 'FAILED' : 'COMPLETED',
				completedAt: new Date()
			})
			.where(eq(newsletterBroadcasts.id, broadcastId));
	} catch (err) {
		console.error(`[newsletter broadcast ${broadcastId}] worker error:`, err);
		await db
			.update(newsletterBroadcasts)
			.set({ status: 'FAILED', completedAt: new Date() })
			.where(eq(newsletterBroadcasts.id, broadcastId));
	}
}

export const sendNewsletter = form(
	sendNewsletterSchema,
	async ({ subject, message, recipientEmails }) => {
		const event = getRequestEvent();
		await requireUser(event);

		let html = '';
		const trimmed = message.trim();
		if (trimmed.toLowerCase().includes('<mjml')) {
			try {
				const compiled = mjml2html(trimmed, { validationLevel: 'soft' });
				if (compiled.errors?.length) {
					console.warn('MJML validation warnings:', compiled.errors);
				}
				html =
					compiled.html || renderEmailTemplate('newsletter-broadcast', { subject, bodyHtml: trimmed });
			} catch (err) {
				console.warn('MJML compile fallback to template:', err);
				html = renderEmailTemplate('newsletter-broadcast', { subject, bodyHtml: trimmed });
			}
		} else {
			html = renderEmailTemplate('newsletter-broadcast', { subject, bodyHtml: trimmed });
		}

		const explicitRecipients = (recipientEmails || '')
			.split(',')
			.map((e) => e.trim())
			.filter(Boolean);

		let targets: string[] = explicitRecipients;
		if (targets.length === 0) {
			const subscribers = await db.select().from(newsletterSubscribers);
			targets = subscribers.map((sub) => sub.email);
		}

		if (targets.length === 0) {
			return invalid('No subscribers found to send to.');
		}

		const plainText = trimmed.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || subject;

		// Create broadcast job row and process in background over pooled SMTP
		const [broadcast] = await db
			.insert(newsletterBroadcasts)
			.values({
				subject,
				totalRecipients: targets.length,
				sentCount: 0,
				failedCount: 0,
				status: 'SENDING'
			})
			.returning();

		void runBroadcastWorker(broadcast.id, targets, subject, plainText, html);
		await getBroadcastHistory().refresh();

		return {
			success: true,
			queued: true,
			broadcastId: broadcast.id,
			sentCount: targets.length,
			message: `Broadcast queued for ${targets.length} subscriber${targets.length === 1 ? '' : 's'}. Sending in the background.`
		};
	}
);

const deleteSubscriberSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty('Subscriber ID is required'))
});

const bulkDeleteSubscribersSchema = v.object({
	ids: v.pipe(
		v.array(v.pipe(v.string(), v.nonEmpty())),
		v.minLength(1, 'Select at least one subscriber')
	)
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

export const deleteSubscribersBulk = command(bulkDeleteSubscribersSchema, async ({ ids }) => {
	const event = getRequestEvent();
	await requireUser(event);

	await db.delete(newsletterSubscribers).where(inArray(newsletterSubscribers.id, ids));
	await getSubscribers().refresh();

	return {
		success: true,
		deletedCount: ids.length,
		message: `Removed ${ids.length} subscriber${ids.length === 1 ? '' : 's'}.`
	};
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
