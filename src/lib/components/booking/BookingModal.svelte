<script lang="ts">
	import { toast } from 'svelte-sonner';
	import {
		X,
		Check,
		Calendar as CalendarIcon,
		Clock,
		ArrowRight,
		ArrowLeft,
		ShieldCheck
	} from 'lucide-svelte';
	import { createBooking } from '#lib/remote/booking.remote.ts';

	let { open = $bindable(false), onClose = () => {} } = $props<{
		open: boolean;
		onClose?: () => void;
	}>();

	// Form fields
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let countryCode = $state('+234');
	let phone = $state('');
	let notes = $state('');

	// Booking step: 1 = Form, 2 = Calendar & Time, 3 = Confirmed
	let step = $state<1 | 2 | 3>(1);
	let isSubmitting = $state(false);
	let confirmedDetails = $state<{
		date: string;
		formattedDate: string;
		timeSlot: string;
		email: string;
	} | null>(null);

	// Calendar state
	const today = new Date();
	let currentMonthDate = $state(new Date(today.getFullYear(), today.getMonth(), 1));
	let selectedDateStr = $state<string>(''); // YYYY-MM-DD
	let selectedTimeSlot = $state<string>('');

	const timeSlots = [
		'10:00 AM',
		'11:30 AM',
		'01:00 PM',
		'02:30 PM',
		'04:00 PM',
		'05:30 PM'
	];

	const countryCodes = [
		{ code: '+234', label: 'NG (+234)', flag: '🇳🇬' },
		{ code: '+1', label: 'US/CA (+1)', flag: '🇺🇸' },
		{ code: '+44', label: 'UK (+44)', flag: '🇬🇧' },
		{ code: '+49', label: 'DE (+49)', flag: '🇩🇪' },
		{ code: '+27', label: 'ZA (+27)', flag: '🇿🇦' },
		{ code: '+254', label: 'KE (+254)', flag: '🇰🇪' },
		{ code: '+233', label: 'GH (+233)', flag: '🇬🇭' },
		{ code: '+971', label: 'AE (+971)', flag: '🇦🇪' }
	];

	// Derived calendar month details
	let monthLabel = $derived(
		currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);

	let calendarDays = $derived.by(() => {
		const year = currentMonthDate.getFullYear();
		const month = currentMonthDate.getMonth();
		const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
		const totalDays = new Date(year, month + 1, 0).getDate();

		const days: Array<{
			dayNum: number;
			dateStr: string;
			isCurrentMonth: boolean;
			isPast: boolean;
			isToday: boolean;
		}> = [];

		for (let i = 0; i < firstDayIndex; i++) {
			days.push({
				dayNum: 0,
				dateStr: '',
				isCurrentMonth: false,
				isPast: true,
				isToday: false
			});
		}

		const todayNormalized = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		).getTime();

		for (let d = 1; d <= totalDays; d++) {
			const dDate = new Date(year, month, d);
			const isPast = dDate.getTime() < todayNormalized;
			const isToday = dDate.getTime() === todayNormalized;
			const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

			days.push({
				dayNum: d,
				dateStr,
				isCurrentMonth: true,
				isPast,
				isToday
			});
		}

		return days;
	});

	function prevMonth() {
		currentMonthDate = new Date(
			currentMonthDate.getFullYear(),
			currentMonthDate.getMonth() - 1,
			1
		);
	}

	function nextMonth() {
		currentMonthDate = new Date(
			currentMonthDate.getFullYear(),
			currentMonthDate.getMonth() + 1,
			1
		);
	}

	function selectDay(day: { dateStr: string; isPast: boolean }) {
		if (day.isPast || !day.dateStr) return;
		selectedDateStr = day.dateStr;
		if (!selectedTimeSlot) {
			selectedTimeSlot = timeSlots[0];
		}
	}

	function isFormValid(): boolean {
		return (
			firstName.trim().length > 0 &&
			lastName.trim().length > 0 &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
			phone.trim().length >= 5
		);
	}

	function handleContinueFromForm() {
		if (!isFormValid()) {
			toast.error('Please complete all required fields (First name, Last name, Email, Phone).');
			return;
		}

		if (!selectedDateStr) {
			const firstAvailable = calendarDays.find((d) => d.isCurrentMonth && !d.isPast);
			if (firstAvailable) {
				selectedDateStr = firstAvailable.dateStr;
				selectedTimeSlot = timeSlots[0];
			}
		}

		step = 2;
	}

	async function handleFinalSubmit() {
		if (!isFormValid()) {
			step = 1;
			toast.error('Please complete the contact form before booking.');
			return;
		}

		if (!selectedDateStr || !selectedTimeSlot) {
			toast.error('Please select both a date and a time slot.');
			return;
		}

		isSubmitting = true;
		try {
			const fullPhone = `${countryCode} ${phone.trim()}`;
			const result = await createBooking({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim().toLowerCase(),
				phone: fullPhone,
				date: selectedDateStr,
				timeSlot: selectedTimeSlot,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Lagos',
				notes: notes.trim()
			});

			if (result && 'booking' in result && result.booking) {
				confirmedDetails = {
					date: result.booking.date,
					formattedDate: result.booking.formattedDate,
					timeSlot: result.booking.timeSlot,
					email: result.booking.email
				};
				step = 3;
				toast.success('Strategy call confirmed! Check your email for details.');
			} else {
				toast.error('Could not complete booking. Please try again.');
			}
		} catch (err: any) {
			toast.error(err?.body?.message || err?.message || 'Error scheduling call. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}

	function close() {
		open = false;
		onClose();
	}

	function openWhatsAppFollowup() {
		const text = encodeURIComponent(
			`Hi Nivabit, I just booked a Strategy Call for ${confirmedDetails?.formattedDate || selectedDateStr} at ${confirmedDetails?.timeSlot || selectedTimeSlot}. Looking forward to connecting!`
		);
		window.open(`https://wa.me/2349066809821?text=${text}`, '_blank');
	}
</script>

{#if open}
	<!-- Modal Backdrop (Bottom-sheet on mobile, centered dialog on sm+) -->
	<div
		class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm transition-opacity sm:items-center sm:p-4"
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
		role="dialog"
		aria-modal="true"
		aria-labelledby="booking-modal-title"
		tabindex="-1"
	>
		<!-- Modal Card: Constrained viewport height with sticky header & scrollable body -->
		<div
			class="relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-slate-200/90 bg-white shadow-2xl transition-all sm:rounded-2xl"
		>
			<!-- Mobile drag handle hint -->
			<div class="flex justify-center pt-2.5 pb-0.5 sm:hidden" aria-hidden="true">
				<span class="h-1 w-10 rounded-full bg-slate-200"></span>
			</div>

			<!-- Sticky Progress Header -->
			<div
				class="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6 sm:py-4"
			>
				<div class="flex items-center gap-4 sm:gap-6">
					<!-- Step 1 Indicator -->
					<button
						type="button"
						onclick={() => (step = 1)}
						class="flex min-h-[36px] cursor-pointer items-center gap-2 text-xs font-bold transition-colors {step ===
						1
							? 'text-slate-900'
							: 'text-slate-500 hover:text-slate-700'}"
					>
						<span
							class="inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold transition-colors {step >=
							1
								? 'bg-[#2563eb] text-white'
								: 'bg-slate-200 text-slate-600'}"
						>
							1
						</span>
						<span>Your details</span>
					</button>

					<!-- Step 2 Indicator -->
					<button
						type="button"
						onclick={() => {
							if (isFormValid()) handleContinueFromForm();
							else toast.error('Please fill in your contact information first.');
						}}
						class="flex min-h-[36px] cursor-pointer items-center gap-2 text-xs font-bold transition-colors {step ===
						2
							? 'text-slate-900'
							: 'text-slate-500 hover:text-slate-700'}"
					>
						<span
							class="inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold transition-colors {step >=
							2
								? 'bg-[#2563eb] text-white'
								: 'bg-slate-200 text-slate-600'}"
						>
							2
						</span>
						<span>Pick time</span>
					</button>
				</div>

				<!-- Close button -->
				<button
					type="button"
					onclick={close}
					class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
					aria-label="Close modal"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			<!-- Scrollable Modal Body -->
			<div class="flex-1 overflow-y-auto overscroll-contain">
				{#if step === 3}
					<!-- Step 3: Success Confirmation State -->
					<div class="p-6 text-center sm:p-12">
						<div
							class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#2563eb] ring-8 ring-[#2563eb]/5 sm:h-16 sm:w-16"
						>
							<Check class="h-7 w-7 stroke-[2.5] sm:h-8 sm:w-8" />
						</div>

						<span
							class="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563eb]"
						>
							<span class="h-1.5 w-1.5 rounded-[1.5px] bg-[#2563eb]"></span>
							Strategy Session Confirmed
						</span>

						<h2
							id="booking-modal-title"
							class="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
						>
							You're on the calendar!
						</h2>

						<p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
							We've reserved your 15-minute product validation sprint session. A confirmation email
							and calendar invitation have been sent to
							<strong class="text-slate-900">{confirmedDetails?.email}</strong>.
						</p>

						<!-- Booking Summary Badge -->
						<div
							class="mx-auto mt-6 max-w-sm rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 text-left text-xs"
						>
							<div class="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
								<span class="font-bold text-slate-500 uppercase">Date</span>
								<span class="font-semibold text-slate-900">{confirmedDetails?.formattedDate}</span>
							</div>
							<div class="flex items-center justify-between pt-2.5">
								<span class="font-bold text-slate-500 uppercase">Time Slot</span>
								<span class="font-bold text-[#2563eb]">{confirmedDetails?.timeSlot} (WAT)</span>
							</div>
						</div>

						<div class="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
							<button
								type="button"
								onclick={openWhatsAppFollowup}
								class="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8]"
							>
								Message Us on WhatsApp
							</button>
							<button
								type="button"
								onclick={close}
								class="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
							>
								Done
							</button>
						</div>
					</div>
				{:else}
					<!-- Steps 1 & 2: Single-step view on mobile (< lg), Two-column on desktop (lg+) -->
					<div class="grid grid-cols-1 lg:grid-cols-12">
						<!-- Left Column: Form & Pitch (visible on Step 1 on mobile, always on lg+) -->
						<div
							class="{step === 2 ? 'hidden lg:block' : 'block'} border-slate-100 p-5 sm:p-7 lg:col-span-5 lg:border-r"
						>
							<div class="mb-4">
								<h3
									id="booking-modal-title"
									class="text-lg font-black tracking-tight text-slate-900 sm:text-xl"
								>
									Nivabit Strategy Call
								</h3>
								<p class="mt-1 text-xs font-bold text-[#2563eb]">
									A quick call to map your validation roadmap.
								</p>
							</div>

							<p class="mb-5 text-xs leading-relaxed text-slate-600">
								15 minutes with the Nivabit team. We'll examine your product hypothesis, identify
								high-risk assumptions, and map how to prove buyer demand before building.
							</p>

							<!-- Form Fields -->
							<div class="space-y-3.5">
								<!-- Phone input with Country selector -->
								<div>
									<label
										for="booking-phone"
										class="mb-1 block text-xs font-bold text-slate-700"
									>
										Phone Number *
									</label>
									<div class="flex gap-2">
										<select
											bind:value={countryCode}
											aria-label="Country code"
											class="shrink-0 rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-base font-medium text-slate-700 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none sm:py-2 sm:text-xs"
										>
											{#each countryCodes as c}
												<option value={c.code}>{c.flag} {c.code}</option>
											{/each}
										</select>
										<input
											id="booking-phone"
											type="tel"
											bind:value={phone}
											placeholder="801 234 5678"
											class="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none sm:py-2 sm:text-xs"
										/>
									</div>
								</div>

								<!-- First & Last Name -->
								<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
									<div>
										<label
											for="booking-fname"
											class="mb-1 block text-xs font-bold text-slate-700"
										>
											First name *
										</label>
										<input
											id="booking-fname"
											type="text"
											bind:value={firstName}
											placeholder="e.g. Alex"
											class="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none sm:py-2 sm:text-xs"
										/>
									</div>
									<div>
										<label
											for="booking-lname"
											class="mb-1 block text-xs font-bold text-slate-700"
										>
											Last name *
										</label>
										<input
											id="booking-lname"
											type="text"
											bind:value={lastName}
											placeholder="e.g. Vance"
											class="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none sm:py-2 sm:text-xs"
										/>
									</div>
								</div>

								<!-- Email -->
								<div>
									<label
										for="booking-email"
										class="mb-1 block text-xs font-bold text-slate-700"
									>
										Email address *
									</label>
									<input
										id="booking-email"
										type="email"
										bind:value={email}
										placeholder="alex@company.com"
										class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none sm:py-2 sm:text-xs"
									/>
								</div>

								<!-- Optional Notes -->
								<div>
									<label
										for="booking-notes"
										class="mb-1 block text-xs font-bold text-slate-700"
									>
										What software idea are you validating? (Optional)
									</label>
									<textarea
										id="booking-notes"
										bind:value={notes}
										rows="2"
										placeholder="Tell us about the problem or target audience..."
										class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none sm:py-2 sm:text-xs"
									></textarea>
								</div>

								<!-- Continue button on Step 1 -->
								{#if step === 1}
									<button
										type="button"
										onclick={handleContinueFromForm}
										class="mt-2 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 sm:text-xs"
									>
										Continue to Calendar
										<ArrowRight class="h-4 w-4 sm:h-3.5 sm:w-3.5" />
									</button>
								{/if}

								<p class="pt-1 text-[11px] leading-snug text-slate-500">
									By entering your information, you consent to our Terms and Privacy Policy.
								</p>
							</div>
						</div>

						<!-- Right Column: Interactive Calendar & Time Picker (visible on Step 2 on mobile, always on lg+) -->
						<div
							class="{step === 1 ? 'hidden lg:flex' : 'flex'} relative flex-col justify-between bg-slate-50/40 p-5 sm:p-7 lg:col-span-7"
						>
							<!-- Desktop-only overlay notice if in Step 1 -->
							{#if step === 1 && (!firstName || !phone || !email)}
								<div
									class="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center bg-white/60 p-4 backdrop-blur-[1px] lg:flex"
								>
									<div
										class="pointer-events-auto rounded-xl border border-slate-200/90 bg-white px-5 py-4 text-center shadow-lg"
									>
										<span
											class="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]"
										>
											<CalendarIcon class="h-4 w-4" />
										</span>
										<p class="text-xs font-bold text-slate-800">
											Please fill out the form before choosing your time slot.
										</p>
										<p class="mt-1 text-[11px] text-slate-500">
											Enter your phone, name, and email on the left to unlock dates.
										</p>
									</div>
								</div>
							{/if}

							<div>
								<!-- Mobile Back to Details Link -->
								<button
									type="button"
									onclick={() => (step = 1)}
									class="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 lg:hidden"
								>
									<ArrowLeft class="h-3.5 w-3.5" />
									Edit contact details
								</button>

								<!-- Calendar Month Header & Switchers -->
								<div class="mb-4 flex items-center justify-between">
									<h4 class="text-sm font-bold text-slate-900">
										{monthLabel}
									</h4>
									<div class="flex items-center gap-1.5">
										<button
											type="button"
											onclick={prevMonth}
											class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-base text-slate-700 transition-colors hover:bg-slate-100"
											aria-label="Previous month"
										>
											&lsaquo;
										</button>
										<button
											type="button"
											onclick={nextMonth}
											class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-base text-slate-700 transition-colors hover:bg-slate-100"
											aria-label="Next month"
										>
											&rsaquo;
										</button>
									</div>
								</div>

								<!-- Days of Week Header -->
								<div class="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-500">
									<span>SUN</span>
									<span>MON</span>
									<span>TUE</span>
									<span>WED</span>
									<span>THU</span>
									<span>FRI</span>
									<span>SAT</span>
								</div>

								<!-- Day Numbers Grid -->
								<div class="mt-2 grid grid-cols-7 gap-1">
									{#each calendarDays as day}
										{#if day.dayNum === 0}
											<div class="h-10 w-full sm:h-9"></div>
										{:else}
											<button
												type="button"
												disabled={day.isPast}
												onclick={() => selectDay(day)}
												class="relative flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-semibold transition-all sm:h-9 {selectedDateStr ===
												day.dateStr
													? 'bg-[#2563eb] font-bold text-white shadow-md shadow-[#2563eb]/30'
													: day.isPast
														? 'cursor-not-allowed text-slate-300'
														: 'text-slate-700 hover:bg-blue-50 hover:text-[#2563eb]'}"
											>
												{day.dayNum}
												{#if day.isToday && selectedDateStr !== day.dateStr}
													<span
														class="absolute bottom-1 h-1.5 w-1.5 rounded-[1px] bg-[#2563eb]"
													></span>
												{/if}
											</button>
										{/if}
									{/each}
								</div>

								<!-- Time Slot Section -->
								<div class="mt-5 border-t border-slate-200/70 pt-4">
									<div class="mb-2.5 flex items-center justify-between gap-2">
										<span class="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
											Available Slots (15 Mins)
										</span>
										{#if selectedDateStr}
											<span class="text-xs font-bold text-[#2563eb]">
												{selectedDateStr}
											</span>
										{/if}
									</div>

									<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
										{#each timeSlots as slot}
											<button
												type="button"
												onclick={() => (selectedTimeSlot = slot)}
												class="flex min-h-[42px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold transition-all {selectedTimeSlot ===
												slot
													? 'border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb] ring-1 ring-[#2563eb]'
													: 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}"
											>
												<Clock
													class="h-3.5 w-3.5 shrink-0 {selectedTimeSlot === slot
														? 'text-[#2563eb]'
														: 'text-slate-400'}"
												/>
												<span>{slot}</span>
											</button>
										{/each}
									</div>
								</div>
							</div>

							<!-- Single Primary Confirm Booking Button (Step 2) -->
							{#if step === 2}
								<div class="mt-6 border-t border-slate-200/70 pt-4">
									<button
										type="button"
										onclick={handleFinalSubmit}
										disabled={isSubmitting || !selectedDateStr || !selectedTimeSlot}
										class="flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
									>
										{#if isSubmitting}
											<span
												class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
											></span>
											Securing your slot...
										{:else}
											Confirm Booking ({selectedDateStr} • {selectedTimeSlot})
											<Check class="h-4 w-4 sm:h-3.5 sm:w-3.5" />
										{/if}
									</button>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Bottom Branded Micro Footer -->
			<div
				class="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] text-slate-500 sm:px-6"
			>
				<div class="flex items-center gap-1.5">
					<span class="inline-block h-2 w-2 rounded-[2px] bg-[#2563eb]"></span>
					<span class="font-bold tracking-tight text-slate-700">NIVABIT</span>
					<span class="hidden sm:inline">• We innovate the bit.</span>
				</div>
				<div class="flex items-center gap-1">
					<ShieldCheck class="h-3.5 w-3.5 text-slate-500" />
					<span>Secure scheduling</span>
				</div>
			</div>
		</div>
	</div>
{/if}
