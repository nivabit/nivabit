<script lang="ts">
	import { getSubscribers, deleteSubscriber } from '#lib/remote/newsletter.remote.ts';
	import {
		Users,
		Mail,
		Search,
		Download,
		Trash2,
		Calendar,
		Send,
		ShieldCheck
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let subscribers = $derived(await getSubscribers());
	let searchTerm = $state('');

	let filteredSubscribers = $derived(
		subscribers.filter((s: any) =>
			s.email.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	async function handleDelete(id: string, email: string) {
		if (!confirm(`Are you sure you want to remove ${email} from subscribers?`)) return;
		try {
			await deleteSubscriber({ id });
			toast.success(`Removed ${email}`);
			await getSubscribers().refresh();
		} catch (err: any) {
			toast.error(err?.message || 'Failed to remove subscriber');
		}
	}

	function exportToCSV() {
		if (subscribers.length === 0) {
			toast.error('No subscribers to export');
			return;
		}

		const rows = [['Email', 'Subscribed Date']];
		subscribers.forEach((s: any) => {
			rows.push([s.email, new Date(s.createdAt).toISOString()]);
		});

		const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', `nivabit-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<svelte:head>
	<title>Newsletter Subscribers | Nivabit CEO</title>
</svelte:head>

<section class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<span class="h-2 w-2 rounded-[1.5px] bg-[#0284c7]"></span>
				<span class="font-mono text-xs font-bold tracking-wider text-[#0284c7] uppercase">
					Audience Management
				</span>
			</div>
			<h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
				The Validation Memo Subscribers
			</h1>
			<p class="text-xs text-slate-500">
				Founders who signed up for the 14-Day Software Validation Dossier and weekly teardowns.
			</p>
		</div>

		<div class="flex items-center gap-2.5">
			<button
				type="button"
				onclick={exportToCSV}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
			>
				<Download class="h-3.5 w-3.5 text-slate-500" />
				Export CSV
			</button>

			<a
				href="/ceo/newsletter"
				class="inline-flex items-center gap-1.5 rounded-xl bg-[#0284c7] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#0284c7]/20 transition-all hover:bg-[#0369a1]"
			>
				<Send class="h-3.5 w-3.5" />
				Send Newsletter
			</a>
		</div>
	</div>

	<!-- Search & Stats Bar -->
	<div class="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search subscriber emails..."
				class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/15 focus:outline-none"
			/>
		</div>

		<div class="flex items-center gap-2">
			<span class="rounded-xl bg-sky-50 px-3.5 py-2 text-xs font-bold text-[#0284c7]">
				{subscribers.length} Active Subscribers
			</span>
		</div>
	</div>

	<!-- Subscribers Table -->
	<div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
		{#if filteredSubscribers.length === 0}
			<div class="p-12 text-center">
				<Users class="mx-auto mb-3 h-10 w-10 text-slate-300" />
				<h3 class="text-sm font-bold text-slate-800">No subscribers found</h3>
				<p class="mt-1 text-xs text-slate-400">
					{searchTerm ? 'No results matched your query.' : 'New opt-ins from /dossier will appear here.'}
				</p>
			</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each filteredSubscribers as s, index}
					<div class="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/60">
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-600">
								{index + 1}
							</div>
							<div>
								<p class="text-xs font-bold text-slate-900 sm:text-sm">
									{s.email}
								</p>
								<div class="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
									<Calendar class="h-3 w-3" />
									<span>Joined {new Date(s.createdAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>

						<div class="flex items-center gap-2">
							<a
								href="mailto:{s.email}"
								class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
								title="Email subscriber directly"
							>
								<Mail class="h-3.5 w-3.5" />
							</a>

							<button
								type="button"
								onclick={() => handleDelete(s.id, s.email)}
								class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
								title="Unsubscribe"
							>
								<Trash2 class="h-3.5 w-3.5" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
