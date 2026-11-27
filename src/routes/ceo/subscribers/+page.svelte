<script lang="ts">
	import {
		getSubscribers,
		deleteSubscriber,
		deleteSubscribersBulk
	} from '#lib/remote/newsletter.remote.ts';
	import {
		Users,
		Mail,
		Search,
		Download,
		Trash2,
		Calendar,
		Send,
		ShieldCheck,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	const PAGE_SIZE = 10;

	let subscribers = $derived(await getSubscribers());
	let searchTerm = $state('');
	let currentPage = $state(1);
	let selected = $state<Record<string, boolean>>({});
	let bulkDeleting = $state(false);

	let filteredSubscribers = $derived(
		subscribers.filter((s: any) =>
			s.email.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	let totalPages = $derived(Math.max(1, Math.ceil(filteredSubscribers.length / PAGE_SIZE)));

	$effect(() => {
		searchTerm;
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	let paginatedSubscribers = $derived(
		filteredSubscribers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
	);

	let selectedSubscribers = $derived(subscribers.filter((s: any) => selected[s.id]));
	let selectedIds = $derived(selectedSubscribers.map((s: any) => s.id));

	function toggleSelect(id: string) {
		selected = { ...selected, [id]: !selected[id] };
	}

	function toggleSelectPage() {
		const allOnPage =
			paginatedSubscribers.length > 0 && paginatedSubscribers.every((s: any) => selected[s.id]);
		const next = { ...selected };
		for (const s of paginatedSubscribers) {
			if (allOnPage) delete next[s.id];
			else next[s.id] = true;
		}
		selected = next;
	}

	function selectAllFiltered() {
		const next: Record<string, boolean> = {};
		for (const s of filteredSubscribers) {
			next[s.id] = true;
		}
		selected = next;
	}

	async function handleBulkDelete() {
		if (selectedIds.length === 0) return;
		if (!confirm(`Remove ${selectedIds.length} selected subscribers permanently?`)) return;
		bulkDeleting = true;
		try {
			const res = await deleteSubscribersBulk({ ids: selectedIds });
			selected = {};
			toast.success(res.message);
		} catch (err: any) {
			toast.error(err?.message || 'Failed to delete selected subscribers');
		} finally {
			bulkDeleting = false;
		}
	}

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

	function exportToCSV(list = subscribers, prefix = 'nivabit-subscribers') {
		if (list.length === 0) {
			toast.error('No subscribers to export');
			return;
		}

		const rows = [['Email', 'Subscribed Date']];
		list.forEach((s: any) => {
			rows.push([s.email, new Date(s.createdAt).toISOString()]);
		});

		const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', `${prefix}-${new Date().toISOString().split('T')[0]}.csv`);
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
				<span class="h-2 w-2 rounded-[1.5px] bg-[#2563eb]"></span>
				<span class="font-mono text-xs font-bold tracking-wider text-[#2563eb] uppercase">
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
				onclick={() => exportToCSV()}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
			>
				<Download class="h-3.5 w-3.5 text-slate-500" />
				Export CSV
			</button>

			<a
				href="/ceo/newsletter"
				class="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8]"
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
				oninput={() => (currentPage = 1)}
				placeholder="Search subscriber emails..."
				class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
			/>
		</div>

		<div class="flex items-center gap-2">
			<span class="rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#2563eb]">
				{subscribers.length} Active Subscribers
			</span>
		</div>
	</div>

	<!-- Bulk Actions Bar -->
	{#if selectedIds.length > 0}
		<div
			class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#2563eb]/25 bg-blue-50/70 px-5 py-3"
		>
			<div class="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-800">
				<span class="rounded-md bg-[#2563eb] px-2 py-0.5 font-bold text-white">
					{selectedIds.length} selected
				</span>
				{#if selectedIds.length < filteredSubscribers.length}
					<button
						type="button"
						onclick={selectAllFiltered}
						class="cursor-pointer font-bold text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]"
					>
						Select all {filteredSubscribers.length}
					</button>
				{/if}
				<button
					type="button"
					onclick={() => (selected = {})}
					class="cursor-pointer text-slate-500 hover:text-slate-800"
				>
					Clear
				</button>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					onclick={() => exportToCSV(selectedSubscribers, 'nivabit-selected-subscribers')}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
				>
					<Download class="h-3.5 w-3.5" />
					Export Selected
				</button>
				<button
					type="button"
					disabled={bulkDeleting}
					onclick={handleBulkDelete}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
				>
					<Trash2 class="h-3.5 w-3.5" />
					{bulkDeleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
				</button>
			</div>
		</div>
	{/if}

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
			<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
				<label class="flex cursor-pointer items-center gap-3 text-xs font-semibold text-slate-700">
					<input
						type="checkbox"
						checked={paginatedSubscribers.length > 0 &&
							paginatedSubscribers.every((s: any) => selected[s.id])}
						onchange={toggleSelectPage}
						class="h-4 w-4 rounded accent-[#2563eb]"
					/>
					<span>Select page</span>
				</label>
				<span class="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
			</div>

			<div class="divide-y divide-slate-100">
				{#each paginatedSubscribers as s, index}
					<div class="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/60">
						<div class="flex items-center gap-3">
							<input
								type="checkbox"
								checked={!!selected[s.id]}
								onchange={() => toggleSelect(s.id)}
								class="h-4 w-4 shrink-0 rounded accent-[#2563eb]"
							/>
							<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-600">
								{(currentPage - 1) * PAGE_SIZE + index + 1}
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

			{#if filteredSubscribers.length > PAGE_SIZE}
				<div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3">
					<p class="text-xs text-slate-500">
						Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(
							currentPage * PAGE_SIZE,
							filteredSubscribers.length
						)} of {filteredSubscribers.length}
					</p>
					<div class="flex items-center gap-1.5">
						<button
							type="button"
							disabled={currentPage <= 1}
							onclick={() => (currentPage = Math.max(1, currentPage - 1))}
							class="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft class="h-3.5 w-3.5" />
							Prev
						</button>
						<button
							type="button"
							disabled={currentPage >= totalPages}
							onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
							class="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							Next
							<ChevronRight class="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</section>
