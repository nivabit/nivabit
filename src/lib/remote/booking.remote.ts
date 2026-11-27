import { command, query, getRequestEvent } from '$app/server';
import { desc } from 'drizzle-orm';
import { db, bookings } from '#lib/server/db/index.ts';
import { requireUser } from '#lib/server/auth.ts';
import { checkSubmissionSpam } from '#lib/server/antiSpam.ts';
import { getPlatformEmailValue } from '#lib/server/platformSettings.ts';
import { sendTemplatedMail } from '#lib/server/mailer.ts';
import { createBookingSchema } from '#lib/validation/validation.ts';

function formatBookingDate(dateStr: string): string {
	try {
		const [year, month, day] = dateStr.split('-').map(Number);
		if (year && month && day) {
			const d = new Date(year, month - 1, day);
			return d.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			});
		}
		return dateStr;
	} catch {
		return dateStr;
	}
}

export const createBooking = command(createBookingSchema, async (data) => {
	const event = getRequestEvent();
	const spam = checkSubmissionSpam(event, {
		scope: 'booking',
		name: `${data.firstName} ${data.lastName}`,
		email: data.email,
		message: data.notes,
		honeypot: data.website,
		startedAt: data._startedAt
	});

	if (spam.blocked) {
		return {
			success: false,
			error: spam.silentDrop
				? 'Unable to schedule call. Please contact us directly.'
				: spam.reason || 'Too many requests. Please try again later.'
		};
	}

	try {
		const [booking] = await db
			.insert(bookings)
			.values({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				date: data.date,
				timeSlot: data.timeSlot,
				timezone: data.timezone || 'Africa/Lagos',
				notes: data.notes || '',
				status: 'CONFIRMED'
			})
			.returning();

		const formattedDate = formatBookingDate(data.date);
		const emailContext = {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			formattedDate,
			timeSlot: data.timeSlot,
			timezone: data.timezone || 'Africa/Lagos',
			notes: data.notes || ''
		};

		// Fire confirmation & admin emails in the background so slow/failing SMTP never blocks or fails a booking
		const adminRecipient = await getPlatformEmailValue();
		void Promise.allSettled([
			sendTemplatedMail({
				to: data.email,
				subject: 'Your Strategy Call is Confirmed — Nivabit',
				template: 'booking-confirmation',
				context: emailContext
			}).catch((mailErr) => {
				console.error('[createBooking] User confirmation email failed:', mailErr);
			}),
			sendTemplatedMail({
				to: adminRecipient,
				subject: `⚡ New Strategy Call: ${data.firstName} ${data.lastName} (${data.date} @ ${data.timeSlot})`,
				template: 'booking-admin-notification',
				context: emailContext
			}).catch((mailErr) => {
				console.error('[createBooking] Admin notification email failed:', mailErr);
			})
		]);

		return {
			success: true,
			message: 'Your strategy call has been scheduled! Check your inbox for confirmation details.',
			booking: {
				id: booking.id,
				firstName: booking.firstName,
				lastName: booking.lastName,
				email: booking.email,
				date: booking.date,
				formattedDate,
				timeSlot: booking.timeSlot,
				timezone: booking.timezone
			}
		};
	} catch (err: any) {
		const cause = err?.cause;
		console.error('[createBooking error]:', {
			message: err?.message,
			code: cause?.code || err?.code,
			detail: cause?.detail,
			cause: cause?.message
		});
		return {
			success: false,
			error:
				cause?.message ||
				err?.message ||
				'Unable to schedule call. Please try again or reach out on WhatsApp.'
		};
	}
});

export const getBookings = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	return db.select().from(bookings).orderBy(desc(bookings.createdAt));
});
