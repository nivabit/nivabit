<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { X, Check, Calendar as CalendarIcon, Clock, ArrowRight, ShieldCheck } from 'lucide-svelte';
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

		// Leading empty blanks from previous month
		for (let i = 0; i < firstDayIndex; i++) {
			days.push({
				dayNum: 0,
				dateStr: '',
				isCurrentMonth: false,
				isPast: true,
				isToday: false
			});
		}

		// Days of month
		const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

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
		currentMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
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
			email.trim().includes('@') &&
			phone.trim().length >= 5
		);
	}

	function handleContinueFromForm() {
		if (!isFormValid()) {
			toast.error('Please complete all required fields (First name, Last name, Email, Phone).');
			return;
		}

		// Pre-select first selectable date if not already selected
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
			toast.error(err?.message || 'Error scheduling call. Please try again.');
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
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm transition-opacity"
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Modal Card -->
		<div
			class="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl transition-all"
		>
			<!-- Top Progress Bar & Header -->
			<div
				class="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4"
			>
				<div class="flex items-center gap-6">
					<!-- Step 1 Indicator -->
					<button
						type="button"
						onclick={() => (step = 1)}
						class="flex items-center gap-2 text-xs font-bold transition-colors {step === 1
							? 'text-slate-900'
							: 'text-slate-400 hover:text-slate-600'}"
					>
						<span
							class="inline-block h-2 w-2 rounded-[1.5px] transition-colors {step === 1
								? 'bg-[#fa8212]'
								: 'bg-[#2563eb]'}"
						></span>
						Fill out the form
					</button>

					<!-- Step 2 Indicator -->
					<button
						type="button"
						onclick={() => {
							if (isFormValid()) step = 2;
							else toast.error('Please fill in your contact information first.');
						}}
						class="flex items-center gap-2 text-xs font-bold transition-colors {step === 2
							? 'text-slate-900'
							: 'text-slate-400 hover:text-slate-600'}"
					>
						<span
							class="inline-block h-2 w-2 rounded-[1.5px] transition-colors {step === 2
								? 'bg-[#fa8212]'
								: step > 2
									? 'bg-[#2563eb]'
									: 'bg-slate-300'}"
						></span>
						Book your event
					</button>
				</div>

				<!-- Close button -->
				<button
					type="button"
					onclick={close}
					class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
					aria-label="Close modal"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			{#if step === 3}
				<!-- Step 3: Success Confirmation State -->
				<div class="p-8 text-center sm:p-12">
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563eb]/10 text-[#2563eb] ring-8 ring-[#2563eb]/5"
					>
						<Check class="h-8 w-8 stroke-[2.5]" />
					</div>

					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563eb]"
					>
						<span class="h-1.5 w-1.5 rounded-[1.5px] bg-[#2563eb]"></span>
						Strategy Session Confirmed
					</span>

					<h2 class="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
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
						<div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
							<span class="font-bold text-slate-500 uppercase">Date</span>
							<span class="font-semibold text-slate-900">{confirmedDetails?.formattedDate}</span>
						</div>
						<div class="flex items-center justify-between pt-2">
							<span class="font-bold text-slate-500 uppercase">Time Slot</span>
							<span class="font-bold text-[#2563eb]">{confirmedDetails?.timeSlot} (WAT)</span>
						</div>
					</div>

					<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<button
							type="button"
							onclick={openWhatsAppFollowup}
							class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-xs font-bold text-white shadow-md shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8]"
						>
							Message Us on WhatsApp
						</button>
						<button
							type="button"
							onclick={close}
							class="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
						>
							Done
						</button>
					</div>
				</div>
			{:else}
				<!-- Steps 1 & 2: Two-column Form and Calendar -->
				<div class="grid grid-cols-1 lg:grid-cols-12">
					<!-- Left Column: Form & Pitch (5 cols on lg) -->
					<div class="border-b border-slate-100 p-6 sm:p-8 lg:col-span-5 lg:border-r lg:border-b-0">
						<div class="mb-4">
							<h3 class="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
								Nivabit Strategy Call
							</h3>
							<p class="mt-1 text-xs font-bold text-[#2563eb]">
								A quick call to map your validation roadmap.
							</p>
						</div>

						<p class="mb-6 text-xs leading-relaxed text-slate-500">
							15 minutes on the phone with the Nivabit engineering team. We'll examine your product
							hypothesis, identify high-risk assumptions, and map the 3 systems to test buyer demand
							before building. Nothing to prepare.
						</p>

						<!-- Form Fields -->
						<div class="space-y-3.5">
							<!-- Phone input with Country selector -->
							<div>
								<label for="booking-phone" class="mb-1 block text-[11px] font-bold text-slate-700">
									Phone Number *
								</label>
								<div class="flex gap-2">
									<select
										bind:value={countryCode}
										class="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 focus:outline-none"
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
										class="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 focus:outline-none"
									/>
								</div>
							</div>

							<!-- First & Last Name -->
							<div class="grid grid-cols-2 gap-2">
								<div>
									<label for="booking-fname" class="mb-1 block text-[11px] font-bold text-slate-700">
										First name *
									</label>
									<input
										id="booking-fname"
										type="text"
										bind:value={firstName}
										placeholder="e.g. Alex"
										class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 focus:outline-none"
									/>
								</div>
								<div>
									<label for="booking-lname" class="mb-1 block text-[11px] font-bold text-slate-700">
										Last name *
									</label>
									<input
										id="booking-lname"
										type="text"
										bind:value={lastName}
										placeholder="e.g. Vance"
										class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 focus:outline-none"
									/>
								</div>
							</div>

							<!-- Email -->
							<div>
								<label for="booking-email" class="mb-1 block text-[11px] font-bold text-slate-700">
									Email address *
								</label>
								<input
									id="booking-email"
									type="email"
									bind:value={email}
									placeholder="alex@company.com"
									class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 focus:outline-none"
								/>
							</div>

							<!-- Optional Notes -->
							<div>
								<label for="booking-notes" class="mb-1 block text-[11px] font-bold text-slate-700">
									What software idea are you looking to validate? (Optional)
								</label>
								<textarea
									id="booking-notes"
									bind:value={notes}
									rows="2"
									placeholder="Tell us about the problem or target audience..."
									class="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 focus:outline-none"
								></textarea>
							</div>

							<!-- Action button for left side -->
							{#if step === 1}
								<button
									type="button"
									onclick={handleContinueFromForm}
									class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"
								>
									Continue to Calendar
									<ArrowRight class="h-3.5 w-3.5" />
								</button>
							{:else}
								<button
									type="button"
									onclick={handleFinalSubmit}
									disabled={isSubmitting || !selectedDateStr || !selectedTimeSlot}
									class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
								>
									{#if isSubmitting}
										<span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
										Securing your slot...
									{:else}
										Confirm Booking
										<Check class="h-3.5 w-3.5" />
									{/if}
								</button>
							{/if}

							<p class="pt-1 text-[10px] leading-tight text-slate-400">
								By entering your information, you consent to our Terms and Privacy Policy.
							</p>
						</div>
					</div>

					<!-- Right Column: Interactive Calendar & Time Picker (7 cols on lg) -->
					<div class="relative flex flex-col justify-between bg-slate-50/40 p-6 sm:p-8 lg:col-span-7">
						<!-- Overlay notice if in Step 1 -->
						{#if step === 1 && (!firstName || !phone || !email)}
							<div
								class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60 p-4 backdrop-blur-[1px]"
							>
								<div
									class="pointer-events-auto rounded-xl border border-slate-200/90 bg-white px-5 py-4 text-center shadow-lg"
								>
									<span class="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
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
							<!-- Calendar Month Header & Switchers -->
							<div class="mb-4 flex items-center justify-between">
								<h4 class="text-sm font-bold text-slate-900">
									{monthLabel}
								</h4>
								<div class="flex items-center gap-1">
									<button
										type="button"
										onclick={prevMonth}
										class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100"
										aria-label="Previous month"
									>
										&lsaquo;
									</button>
									<button
										type="button"
										onclick={nextMonth}
										class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100"
										aria-label="Next month"
									>
										&rsaquo;
									</button>
								</div>
							</div>

							<!-- Days of Week Header -->
							<div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
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
										<div class="h-8 w-full"></div>
									{:else}
										<button
											type="button"
											disabled={day.isPast}
											onclick={() => selectDay(day)}
											class="relative flex h-8 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-semibold transition-all {selectedDateStr ===
											day.dateStr
												? 'bg-[#2563eb] font-bold text-white shadow-md shadow-[#2563eb]/30'
												: day.isPast
													? 'cursor-not-allowed text-slate-300'
													: 'text-slate-700 hover:bg-blue-50 hover:text-[#2563eb]'}"
										>
											{day.dayNum}
											{#if day.isToday && selectedDateStr !== day.dateStr}
												<span
													class="absolute bottom-1 h-1.5 w-1.5 rounded-[1px] bg-[#fa8212]"
												></span>
											{/if}
										</button>
									{/if}
								{/each}
							</div>

							<!-- Time Slot Section -->
							<div class="mt-6 border-t border-slate-200/70 pt-4">
								<div class="mb-2.5 flex items-center justify-between">
									<span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
										Available Time Slots (15 Mins)
									</span>
									{#if selectedDateStr}
										<span class="text-[11px] font-bold text-[#2563eb]">
											{selectedDateStr}
										</span>
									{/if}
								</div>

								<div class="grid grid-cols-3 gap-2">
									{#each timeSlots as slot}
										<button
											type="button"
											onclick={() => (selectedTimeSlot = slot)}
											class="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all {selectedTimeSlot ===
											slot
												? 'border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb] ring-1 ring-[#2563eb]'
												: 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}"
										>
											<Clock class="h-3 w-3 {selectedTimeSlot === slot ? 'text-[#2563eb]' : 'text-slate-400'}" />
											{slot}
										</button>
									{/each}
								</div>
							</div>
						</div>

						<!-- Final Booking Action on Step 2 (Mobile / Desktop) -->
						{#if step === 2}
							<div class="mt-6 border-t border-slate-200/70 pt-4">
								<button
									type="button"
									onclick={handleFinalSubmit}
									disabled={isSubmitting || !selectedDateStr || !selectedTimeSlot}
									class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-xs font-bold text-white shadow-md shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
								>
									{#if isSubmitting}
										<span class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
										Securing your slot...
									{:else}
										Confirm Booking for {selectedDateStr} @ {selectedTimeSlot}
										<Check class="h-3.5 w-3.5" />
									{/if}
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Bottom Branded Micro Footer -->
			<div
				class="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-2.5 text-[11px] text-slate-400"
			>
				<div class="flex items-center gap-1.5">
					<span class="inline-block h-2 w-2 rounded-[2px] bg-[#2563eb]"></span>
					<span class="font-bold tracking-tight text-slate-700">NIVABIT</span>
					<span>— We innovate the bit.</span>
				</div>
				<div class="flex items-center gap-1">
					<ShieldCheck class="h-3.5 w-3.5 text-slate-400" />
					<span>Secure scheduling</span>
				</div>
			</div>
		</div>
	</div>
{/if}
