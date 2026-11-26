<script lang="ts">
	import { formatNumberWithCommas } from '#lib/utils/formatNumber.js';
	import {
		FileText,
		Users,
		Eye,
		MessageCircle,
		Calendar,
		TrendingUp,
		Plus,
		Mail,
		ArrowRight,
		CheckCircle2,
		ExternalLink,
		Clock
	} from 'lucide-svelte';
	import { getAdminArticles } from '#lib/remote/articles.remote.ts';
	import { getAdminProfile, getDashboardStats, getPlatformMetrics } from '#lib/remote/admin.remote.ts';
	import { getBookings } from '#lib/remote/booking.remote.ts';

	const [user, dashboardStats, recentArticles, bookings, metrics] = await Promise.all([
		getAdminProfile(),
		getDashboardStats(),
		getAdminArticles(),
		getBookings(),
		getPlatformMetrics()
	]);

	let statsData = $derived(dashboardStats.stats);
	let quickStats = $derived(dashboardStats.quickStats);

	const statsCards = $derived([
		{
			name: 'Strategy Bookings',
			value: bookings.length,
			trend: 'Active Inbounds',
			icon: Calendar,
			href: '/ceo/bookings',
			accent: 'text-[#2563eb]',
			bg: 'bg-blue-50'
		},
		{
			name: 'Newsletter Subscribers',
			value: statsData.totalSubscribers ?? 0,
			trend: '14-Day Dossier',
			icon: Users,
			href: '/ceo/subscribers',
			accent: 'text-[#fa8212]',
			bg: 'bg-[#fff7ed]'
		},
		{
			name: 'Published Articles',
			value: statsData.totalArticles,
			trend: `${formatNumberWithCommas(statsData.totalViews)} views`,
			icon: FileText,
			href: '/ceo/articles',
			accent: 'text-emerald-600',
			bg: 'bg-emerald-50'
		},
		{
			name: 'Lead Messages',
			value: statsData.totalContacts,
			trend: `${statsData.unreadContacts} unread`,
			icon: MessageCircle,
			href: '/ceo/messages',
			accent: 'text-amber-600',
			bg: 'bg-amber-50'
		}
	]);

	function openWhatsApp(phone: string, firstName: string, date: string, timeSlot: string) {
		const cleanPhone = phone.replace(/[^0-9]/g, '');
		const text = encodeURIComponent(
			`Hi ${firstName}, this is Owonikoko from Nivabit regarding our scheduled Strategy Call on ${date} at ${timeSlot}. Looking forward to connecting!`
		);
		window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
	}
</script>

<svelte:head>
	<title>CEO Command Center | Nivabit</title>
</svelte:head>

<section class="space-y-8">
	<!-- Executive Welcome Hero -->
	<div class="relative overflow-hidden rounded-2xl bg-[#090d14] p-8 text-white shadow-xl">
		<div class="pointer-events-none absolute inset-0 overflow-hidden">
			<div class="absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#2563eb]/20 blur-3xl"></div>
		</div>

		<div class="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
			<div>
				<div class="mb-2 flex items-center gap-2">
					<span class="h-2 w-2 rounded-[1.5px] bg-[#fa8212]"></span>
					<span class="font-mono text-xs font-bold tracking-wider text-[#fa8212] uppercase">
						CEO Executive Overview
					</span>
				</div>
				<h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
					Welcome back, {user?.name || 'Owonikoko'}!
				</h1>
				<p class="mt-1 text-xs text-slate-400 sm:text-sm">
					Here is your platform traction, upcoming founder strategy calls, and content growth.
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<a
					href="/ceo/articles/create"
					class="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8]"
				>
					<Plus class="h-4 w-4" />
					New Article
				</a>
				<a
					href="/ceo/newsletter"
					class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:bg-white/10"
				>
					<Mail class="h-4 w-4" />
					Send Newsletter
				</a>
			</div>
		</div>
	</div>

	<!-- Top 4 Primary KPIs -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each statsCards as stat}
			{@const Icon = stat.icon}
			<a
				href={stat.href}
				class="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
			>
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
						{stat.name}
					</span>
					<div class="flex h-9 w-9 items-center justify-center rounded-xl {stat.bg} {stat.accent} transition-transform group-hover:scale-110">
						<Icon class="h-4 w-4" />
					</div>
				</div>

				<div class="mt-4">
					<h3 class="text-3xl font-black tracking-tight text-slate-900">
						{stat.value}
					</h3>
					<div class="mt-1 flex items-center justify-between text-xs">
						<span class="font-semibold text-slate-500">{stat.trend}</span>
						<span class="flex items-center gap-1 font-bold text-[#2563eb] group-hover:underline">
							View &rarr;
						</span>
					</div>
				</div>
			</a>
		{/each}
	</div>

	<!-- Middle Row: Strategy Bookings & Quick Actions -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
		<!-- Inbound Strategy Call Bookings (7 cols) -->
		<div class="lg:col-span-7">
			<div class="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
				<div class="flex items-center justify-between border-b border-slate-100 p-5">
					<div class="flex items-center gap-2">
						<Calendar class="h-4 w-4 text-[#2563eb]" />
						<h2 class="text-base font-black text-slate-900">Recent Strategy Calls</h2>
					</div>
					<a href="/ceo/bookings" class="text-xs font-bold text-[#2563eb] hover:underline">
						View All ({bookings.length})
					</a>
				</div>

				<div class="divide-y divide-slate-100">
					{#if bookings.length === 0}
						<div class="p-8 text-center text-xs text-slate-400">
							No strategy calls booked yet. Calls scheduled through the website modal will show up here.
						</div>
					{:else}
						{#each bookings.slice(0, 4) as b}
							<div class="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/60">
								<div>
									<h4 class="text-xs font-bold text-slate-900 sm:text-sm">
										{b.firstName} {b.lastName}
									</h4>
									<div class="mt-0.5 flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500">
										<span class="flex items-center gap-1 font-semibold text-[#2563eb]">
											<Clock class="h-3 w-3" />
											{b.date} @ {b.timeSlot}
										</span>
										<span>{b.email}</span>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<button
										type="button"
										onclick={() => openWhatsApp(b.phone, b.firstName, b.date, b.timeSlot)}
										class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
									>
										WhatsApp
										<ExternalLink class="h-2.5 w-2.5" />
									</button>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Quick Actions & Growth Shortcuts (5 cols) -->
		<div class="space-y-6 lg:col-span-5">
			<div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
				<h3 class="mb-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
					Quick Execution
				</h3>

				<div class="space-y-2.5">
					<a
						href="/ceo/articles/create"
						class="flex items-center justify-between rounded-xl border border-slate-200/70 p-3 transition-colors hover:border-[#2563eb] hover:bg-blue-50/40"
					>
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
								<FileText class="h-4 w-4" />
							</div>
							<div>
								<p class="text-xs font-bold text-slate-900">Publish Validation Article</p>
								<p class="text-[10px] text-slate-500">Draft or schedule deep-dive teardown</p>
							</div>
						</div>
						<ArrowRight class="h-3.5 w-3.5 text-slate-400" />
					</a>

					<a
						href="/ceo/newsletter"
						class="flex items-center justify-between rounded-xl border border-slate-200/70 p-3 transition-colors hover:border-[#2563eb] hover:bg-blue-50/40"
					>
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
								<Mail class="h-4 w-4" />
							</div>
							<div>
								<p class="text-xs font-bold text-slate-900">Broadcast Newsletter</p>
								<p class="text-[10px] text-slate-500">Send to all {statsData.totalSubscribers ?? 0} subscribers</p>
							</div>
						</div>
						<ArrowRight class="h-3.5 w-3.5 text-slate-400" />
					</a>

					<a
						href="/ceo/metrics"
						class="flex items-center justify-between rounded-xl border border-slate-200/70 p-3 transition-colors hover:border-[#2563eb] hover:bg-blue-50/40"
					>
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
								<TrendingUp class="h-4 w-4" />
							</div>
							<div>
								<p class="text-xs font-bold text-slate-900">Update Platform Metrics</p>
								<p class="text-[10px] text-slate-500">Manage public traction numbers</p>
							</div>
						</div>
						<ArrowRight class="h-3.5 w-3.5 text-slate-400" />
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom Row: Recent Articles & Platform Proof Metrics -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
		<!-- Recent Articles (7 cols) -->
		<div class="lg:col-span-7">
			<div class="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
				<div class="flex items-center justify-between border-b border-slate-100 p-5">
					<h2 class="text-base font-black text-slate-900">Published Content</h2>
					<a href="/ceo/articles" class="text-xs font-bold text-[#2563eb] hover:underline">
						Manage Articles
					</a>
				</div>

				<div class="divide-y divide-slate-100">
					{#if recentArticles.length === 0}
						<div class="p-8 text-center text-xs text-slate-400">
							No articles written yet. Click "New Article" to create your first teardown.
						</div>
					{:else}
						{#each recentArticles.slice(0, 4) as art}
							<div class="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/60">
								<div class="flex-1 pr-4">
									<h4 class="text-xs font-bold text-slate-900 sm:text-sm">
										{art.title}
									</h4>
									<div class="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
										<span>{art.categories?.[0] || 'Validation'}</span>
										<span>•</span>
										<span class="flex items-center gap-1">
											<Eye class="h-3 w-3" />
											{art.views} views
										</span>
									</div>
								</div>

								<div class="flex items-center gap-2">
									<span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
										{art.status}
									</span>
									<a
										href="/ceo/articles/{art.id}/edit"
										class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
									>
										Edit
									</a>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Platform Metrics Snapshot (5 cols) -->
		<div class="lg:col-span-5">
			<div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-xs font-bold tracking-wider text-slate-500 uppercase">
						Live Proof Metrics
					</h3>
					<a href="/ceo/metrics" class="text-xs font-bold text-[#2563eb] hover:underline">
						Edit Metrics
					</a>
				</div>

				<div class="space-y-3">
					{#each metrics.slice(0, 4) as m}
						<div class="flex items-center justify-between rounded-xl bg-slate-50 p-3">
							<div>
								<p class="text-xs font-bold text-slate-800">{m.label}</p>
								<p class="text-[10px] text-slate-400">{m.category}</p>
							</div>
							<div class="text-right">
								<p class="text-base font-black text-[#2563eb]">{m.value}</p>
								<p class="text-[10px] font-bold text-emerald-600">{m.change || 'Verified'}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
