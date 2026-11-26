<script lang="ts">
	import { getBookings } from '#lib/remote/booking.remote.ts';
	import {
		Calendar,
		Clock,
		Mail,
		Phone,
		Search,
		User,
		FileText,
		CheckCircle2,
		MessageSquare,
		ExternalLink
	} from 'lucide-svelte';

	let bookings = $derived(await getBookings());
	let searchTerm = $state('');
	let statusFilter = $state('All');

	let filteredBookings = $derived(
		bookings.filter((b: any) => {
			const text = `${b.firstName} ${b.lastName} ${b.email} ${b.phone} ${b.notes || ''}`.toLowerCase();
			const matchesSearch = text.includes(searchTerm.toLowerCase());
			const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
			return matchesSearch && matchesStatus;
		})
	);

	function openWhatsApp(phone: string, firstName: string, date: string, timeSlot: string) {
		const cleanPhone = phone.replace(/[^0-9]/g, '');
		const text = encodeURIComponent(
			`Hi ${firstName}, this is Owonikoko from Nivabit regarding our scheduled Strategy Call on ${date} at ${timeSlot}. Looking forward to connecting!`
		);
		window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
	}
</script>

<svelte:head>
	<title>Strategy Bookings | Nivabit CEO</title>
</svelte:head>

<section class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<span class="h-2 w-2 rounded-[1.5px] bg-[#2563eb]"></span>
				<span class="font-mono text-xs font-bold tracking-wider text-[#2563eb] uppercase">
					Calendar Intel
				</span>
			</div>
			<h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
				Strategy Call Bookings
			</h1>
			<p class="text-xs text-slate-500">
				Manage inbound founder calls, validation sessions, and upcoming appointments.
			</p>
		</div>

		<div class="flex items-center gap-2">
			<span class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs">
				Total Sessions: <strong class="text-[#2563eb]">{bookings.length}</strong>
			</span>
		</div>
	</div>

	<!-- Filter & Search Controls -->
	<div class="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search bookings by founder name, email, phone..."
				class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
			/>
		</div>

		<div class="flex items-center gap-2">
			<select
				bind:value={statusFilter}
				class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#2563eb] focus:outline-none"
			>
				<option value="All">All Statuses</option>
				<option value="CONFIRMED">Confirmed</option>
				<option value="PENDING">Pending</option>
				<option value="CANCELLED">Cancelled</option>
			</select>
		</div>
	</div>

	<!-- Bookings List / Table -->
	<div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
		{#if filteredBookings.length === 0}
			<div class="p-12 text-center">
				<Calendar class="mx-auto mb-3 h-10 w-10 text-slate-300" />
				<h3 class="text-sm font-bold text-slate-800">No strategy calls found</h3>
				<p class="mt-1 text-xs text-slate-400">
					{searchTerm ? 'Try adjusting your search criteria.' : 'Bookings made via the website modal will appear here.'}
				</p>
			</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each filteredBookings as b}
					<div class="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-slate-50/60 sm:flex-row sm:items-center">
						<div class="flex items-start gap-3.5">
							<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
								<User class="h-5 w-5" />
							</div>

							<div>
								<div class="flex items-center gap-2">
									<h4 class="text-sm font-bold text-slate-900">
										{b.firstName} {b.lastName}
									</h4>
									<span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
										{b.status}
									</span>
								</div>

								<div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
									<span class="flex items-center gap-1">
										<Calendar class="h-3.5 w-3.5 text-[#2563eb]" />
										<strong class="text-slate-700">{b.date}</strong>
									</span>
									<span class="flex items-center gap-1">
										<Clock class="h-3.5 w-3.5 text-slate-400" />
										{b.timeSlot} ({b.timezone})
									</span>
									<span class="flex items-center gap-1">
										<Mail class="h-3.5 w-3.5 text-slate-400" />
										<a href="mailto:{b.email}" class="hover:text-[#2563eb]">{b.email}</a>
									</span>
									<span class="flex items-center gap-1">
										<Phone class="h-3.5 w-3.5 text-slate-400" />
										<a href="tel:{b.phone}" class="hover:text-[#2563eb]">{b.phone}</a>
									</span>
								</div>

								{#if b.notes}
									<p class="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
										<strong class="text-slate-800">Founder Notes:</strong> {b.notes}
									</p>
								{/if}
							</div>
						</div>

						<div class="flex items-center gap-2 self-end sm:self-center">
							<button
								type="button"
								onclick={() => openWhatsApp(b.phone, b.firstName, b.date, b.timeSlot)}
								class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
							>
								WhatsApp
								<ExternalLink class="h-3 w-3" />
							</button>

							<a
								href="mailto:{b.email}?subject=Nivabit Strategy Call ({b.date} @ {b.timeSlot})"
								class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
							>
								Email
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
