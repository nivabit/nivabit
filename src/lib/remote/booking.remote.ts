import { command, query, getRequestEvent } from '$app/server';
import { prisma } from '#lib/server/prisma.ts';
import { requireUser } from '#lib/server/auth.ts';
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
	try {
		const booking = await prisma.booking.create({
			data: {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				date: data.date,
				timeSlot: data.timeSlot,
				timezone: data.timezone || 'Africa/Lagos',
				notes: data.notes || '',
				status: 'CONFIRMED'
			}
		});

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

		// 1. Send confirmation to attendee using Handlebars template
		try {
			await sendTemplatedMail({
				to: data.email,
				subject: 'Your Strategy Call is Confirmed — Nivabit',
				template: 'booking-confirmation',
				context: emailContext
			});
		} catch (mailErr) {
			console.error('[createBooking] User confirmation email failed:', mailErr);
		}

		// 2. Send notification to Nivabit team using Handlebars template
		try {
			const adminRecipient = process.env.SMTP_USERNAME || 'contact@nivabit.com';
			await sendTemplatedMail({
				to: adminRecipient,
				subject: `⚡ New Strategy Call: ${data.firstName} ${data.lastName} (${data.date} @ ${data.timeSlot})`,
				template: 'booking-admin-notification',
				context: emailContext
			});
		} catch (mailErr) {
			console.error('[createBooking] Admin notification email failed:', mailErr);
		}

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
		console.error('[createBooking error]:', err);
		throw new Error(err?.message || 'Unable to schedule call. Please try again or reach out on WhatsApp.');
	}
});

export const getBookings = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	return prisma.booking.findMany({
		orderBy: { createdAt: 'desc' }
	});
});
