<script lang="ts">
	import RichTextEditor from '#lib/components/layout/RichTextEditor.svelte';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import {
		Search,
		Mail as MailIcon,
		Send,
		Trash2,
		Loader,
		ChevronLeft,
		ChevronRight,
		Download,
		X
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import {
		deleteSubscriber,
		deleteSubscribersBulk,
		getBroadcastHistory,
		getSubscribers,
		sendNewsletter
	} from '#lib/remote/newsletter.remote.ts';
	import { sendNewsletterSchema } from '#lib/validation/validation.ts';

	const PAGE_SIZE = 10;

	let subscribers = $derived(await getSubscribers());
	let broadcasts = $derived(await getBroadcastHistory());

	// Auto-poll broadcast history every 3s while any broadcast is actively sending
	let hasActiveBroadcast = $derived(
		broadcasts.some((b: any) => b.status === 'QUEUED' || b.status === 'SENDING')
	);

	$effect(() => {
		if (!hasActiveBroadcast) return;
		const timer = setInterval(() => {
			getBroadcastHistory().refresh();
		}, 3000);
		return () => clearInterval(timer);
	});

	let query = $state('');
	let currentPage = $state(1);
	let selected = $state<Record<string, boolean>>({});

	// Compose modal state
	let composeOpen = $state(false);
	let message = $state('');

	// Delete confirmation modal state
	let confirmOpen = $state(false);
	let pendingDelete = $state<{ id: string; email: string } | null>(null);
	let bulkDeleteOpen = $state(false);
	let deleting = $state(false);

	let rootIssues = $derived(
		(sendNewsletter.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);

	let filtered = $derived(
		subscribers.filter((s: any) => s.email.toLowerCase().includes(query.trim().toLowerCase()))
	);

	let totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

	$effect(() => {
		// Reset to page 1 when search query changes or totalPages shrinks
		query;
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	let paginated = $derived(
		filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
	);

	let selectedSubscribers = $derived(subscribers.filter((s: any) => selected[s.id]));
	let selectedIds = $derived(selectedSubscribers.map((s: any) => s.id));
	let selectedEmails = $derived(selectedSubscribers.map((s: any) => s.email));

	function toggleSelect(id: string) {
		selected = { ...selected, [id]: !selected[id] };
	}

	function toggleSelectPage() {
		const allOnPageSelected = paginated.length > 0 && paginated.every((s: any) => selected[s.id]);
		const next = { ...selected };
		for (const s of paginated) {
			if (allOnPageSelected) delete next[s.id];
			else next[s.id] = true;
		}
		selected = next;
	}

	function selectAllFiltered() {
		const next: Record<string, boolean> = {};
		for (const s of filtered) {
			next[s.id] = true;
		}
		selected = next;
	}

	function exportSelectedCSV() {
		if (selectedSubscribers.length === 0) return;
		const rows = [['Email', 'Subscribed Date']];
		selectedSubscribers.forEach((s: any) => {
			rows.push([s.email, new Date(s.createdAt).toISOString()]);
		});
		const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
		const link = document.createElement('a');
		link.setAttribute('href', encodeURI(csvContent));
		link.setAttribute(
			'download',
			`nivabit-selected-subscribers-${new Date().toISOString().split('T')[0]}.csv`
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	async function handleBulkDeleteConfirmed() {
		if (selectedIds.length === 0) return;
		deleting = true;
		try {
			const res = await deleteSubscribersBulk({ ids: selectedIds });
			selected = {};
			bulkDeleteOpen = false;
			toast.success(res.message);
		} catch (err: any) {
			toast.error('Bulk delete failed', {
				description: err?.message || 'Unable to remove selected subscribers'
			});
		} finally {
			deleting = false;
		}
	}

	async function handleDeleteConfirmed() {
		if (!pendingDelete) return;
		deleting = true;
		try {
			await deleteSubscriber({ id: pendingDelete.id });
			const next = { ...selected };
			delete next[pendingDelete.id];
			selected = next;
			toast.success(`Removed ${pendingDelete.email}`);
			confirmOpen = false;
			pendingDelete = null;
		} catch (err: any) {
			toast.error('Failed to remove subscriber', {
				description: err?.message || 'Unable to delete subscriber'
			});
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>Send Newsletter | Nivabit CEO</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<span class="h-2 w-2 rounded-[1.5px] bg-[#2563eb]"></span>
				<span class="font-mono text-xs font-bold tracking-wider text-[#2563eb] uppercase">
					Broadcast Center
				</span>
			</div>
			<h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
				Newsletter Broadcasts
			</h1>
			<p class="text-xs text-slate-500">
				Manage subscribers and compose email broadcasts to your audience.
			</p>
		</div>

		<button
			type="button"
			onclick={() => (composeOpen = true)}
			disabled={subscribers.length === 0}
			class="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Send class="h-3.5 w-3.5" />
			{#if selectedEmails.length > 0}
				Compose to {selectedEmails.length} Selected
			{:else}
				Compose Newsletter
			{/if}
		</button>
	</div>

	<!-- Recent Broadcasts Queue Status -->
	{#if broadcasts.length > 0}
		<div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
			<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
				<span class="text-xs font-bold tracking-wider text-slate-600 uppercase">
					Recent Broadcasts
				</span>
				{#if hasActiveBroadcast}
					<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb]">
						<Loader size={12} class="animate-spin" />
						Sending in background...
					</span>
				{/if}
			</div>
			<div class="divide-y divide-slate-100">
				{#each broadcasts.slice(0, 5) as b (b.id)}
					{@const pct =
						b.totalRecipients > 0
							? Math.min(100, Math.round(((b.sentCount + b.failedCount) / b.totalRecipients) * 100))
							: 0}
					<div class="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
						<div class="min-w-0">
							<p class="truncate text-xs font-bold text-slate-900">{b.subject}</p>
							<p class="text-[11px] text-slate-400">
								{new Date(b.createdAt).toLocaleString()} • {b.sentCount}/{b.totalRecipients} sent
								{#if b.failedCount > 0}
									<span class="text-red-500">({b.failedCount} failed)</span>
								{/if}
							</p>
						</div>

						<div class="flex items-center gap-3">
							{#if b.status === 'SENDING' || b.status === 'QUEUED'}
								<div class="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
									<div
										class="h-full rounded-full bg-[#2563eb] transition-all duration-300"
										style={`width: ${pct}%`}
									></div>
								</div>
							{/if}
							<span
								class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase {b.status ===
								'COMPLETED'
									? 'bg-emerald-50 text-emerald-700'
									: b.status === 'FAILED'
										? 'bg-red-50 text-red-700'
										: 'bg-blue-50 text-[#2563eb]'}"
							>
								{b.status}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Search & Stats Bar -->
	<div
		class="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
	>
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				bind:value={query}
				oninput={() => (currentPage = 1)}
				placeholder="Search subscribers..."
				class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
			/>
		</div>

		<div class="flex items-center gap-2">
			<span class="rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#2563eb]">
				{filtered.length} Subscriber{filtered.length === 1 ? '' : 's'}
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
				{#if selectedIds.length < filtered.length}
					<button
						type="button"
						onclick={selectAllFiltered}
						class="cursor-pointer font-bold text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]"
					>
						Select all {filtered.length}
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
					onclick={() => (composeOpen = true)}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#2563eb] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1d4ed8]"
				>
					<Send size={13} />
					Email Selected
				</button>
				<button
					type="button"
					onclick={exportSelectedCSV}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
				>
					<Download size={13} />
					Export CSV
				</button>
				<button
					type="button"
					onclick={() => (bulkDeleteOpen = true)}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
				>
					<Trash2 size={13} />
					Delete ({selectedIds.length})
				</button>
			</div>
		</div>
	{/if}

	<!-- Subscribers Table + Pagination -->
	<div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
		<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
			<label class="flex cursor-pointer items-center gap-3 text-xs font-semibold text-slate-700">
				<input
					type="checkbox"
					checked={paginated.length > 0 && paginated.every((s: any) => selected[s.id])}
					onchange={toggleSelectPage}
					class="h-4 w-4 rounded accent-[#2563eb]"
				/>
				<span>Select page</span>
			</label>
			<span class="text-xs text-slate-500">
				Page {currentPage} of {totalPages}
			</span>
		</div>

		<div class="divide-y divide-slate-100">
			{#if paginated.length === 0}
				<div class="p-12 text-center">
					<MailIcon class="mx-auto mb-3 h-10 w-10 text-slate-300" />
					<h3 class="text-sm font-bold text-slate-800">No subscribers found</h3>
					<p class="mt-1 text-xs text-slate-400">
						{query ? 'Try a different search term.' : 'New newsletter signups will appear here.'}
					</p>
				</div>
			{:else}
				{#each paginated as s (s.id)}
					<div class="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/60">
						<div class="flex min-w-0 items-center gap-3">
							<input
								type="checkbox"
								checked={!!selected[s.id]}
								onchange={() => toggleSelect(s.id)}
								class="h-4 w-4 shrink-0 rounded accent-[#2563eb]"
							/>
							<div class="min-w-0">
								<p class="truncate text-sm font-semibold text-slate-900">{s.email}</p>
								<p class="text-[11px] text-slate-400">
									Joined {new Date(s.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>

						<button
							type="button"
							onclick={() => {
								pendingDelete = { id: s.id, email: s.email };
								confirmOpen = true;
							}}
							class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
							title="Delete subscriber"
							aria-label={`Delete ${s.email}`}
						>
							<Trash2 size={14} />
						</button>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Pagination Footer -->
		{#if filtered.length > PAGE_SIZE}
			<div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3">
				<p class="text-xs text-slate-500">
					Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(
						currentPage * PAGE_SIZE,
						filtered.length
					)} of {filtered.length}
				</p>

				<div class="flex items-center gap-1.5">
					<button
						type="button"
						disabled={currentPage <= 1}
						onclick={() => (currentPage = Math.max(1, currentPage - 1))}
						class="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronLeft size={14} />
						Prev
					</button>
					<button
						type="button"
						disabled={currentPage >= totalPages}
						onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
						class="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Next
						<ChevronRight size={14} />
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Compose Newsletter Modal -->
{#if composeOpen}
	<div
		class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
		onclick={(e) => {
			if (e.target === e.currentTarget) composeOpen = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') composeOpen = false;
		}}
		role="dialog"
		aria-modal="true"
		aria-labelledby="compose-newsletter-title"
		tabindex="-1"
	>
		<div
			class="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
		>
			<!-- Modal Header -->
			<div class="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
				<div>
					<h2 id="compose-newsletter-title" class="text-base font-bold text-slate-900">
						Compose Newsletter
					</h2>
					<p class="text-xs text-slate-500">
						{#if selectedEmails.length > 0}
							Sending to <strong class="text-[#2563eb]">{selectedEmails.length} selected</strong> subscriber{selectedEmails.length === 1 ? '' : 's'}
						{:else}
							Sending to <strong class="text-[#2563eb]">all {subscribers.length}</strong> active subscribers
						{/if}
					</p>
				</div>

				<button
					type="button"
					onclick={() => (composeOpen = false)}
					class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900"
					aria-label="Close modal"
				>
					<X size={16} />
				</button>
			</div>

			<!-- Modal Body (Form) -->
			<form
				class="flex flex-1 flex-col overflow-y-auto p-6"
				{...sendNewsletter.preflight(sendNewsletterSchema).enhance(async ({ form, submit }) => {
					const ok = await submit();
					if (!ok) return;
					toast.success('Broadcast queued & sending', {
						description:
							selectedEmails.length > 0
								? `Delivering in the background to ${selectedEmails.length} selected subscriber${selectedEmails.length === 1 ? '' : 's'}.`
								: `Delivering in the background to all ${subscribers.length} subscribers.`
					});
					message = '';
					form.reset();
					composeOpen = false;
					await getBroadcastHistory().refresh();
				})}
			>
				<input
					{...sendNewsletter.fields.recipientEmails.as('hidden', selectedEmails.join(','))}
				/>
				<input {...sendNewsletter.fields.message.as('hidden', message)} />

				<div class="space-y-4">
					<div>
						<label for="newsletter-subject" class="mb-1.5 block text-xs font-bold text-slate-700">
							Subject Line *
						</label>
						<input
							id="newsletter-subject"
							{...sendNewsletter.fields.subject.as('text')}
							placeholder="e.g. Issue #43: Validating B2B pricing before writing code"
							class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
						/>
						{#each sendNewsletter.fields.subject.issues() as issue}
							<p class="mt-1 text-xs text-red-500">{issue.message}</p>
						{/each}
					</div>

					<div>
						<p class="mb-1.5 block text-xs font-bold text-slate-700">Message Body *</p>
						<RichTextEditor bind:value={message} />
						{#each sendNewsletter.fields.message.issues() as issue}
							<p class="mt-1 text-xs text-red-500">{issue.message}</p>
						{/each}
					</div>

					{#each rootIssues as issue}
						<div class="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5">
							<p class="text-xs text-red-600">{issue.message}</p>
						</div>
					{/each}
				</div>

				<div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
					<button
						type="button"
						onclick={() => {
							message = '';
							sendNewsletter.fields.set({ subject: '', message: '', recipientEmails: '' });
						}}
						class="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
					>
						Clear
					</button>

					<div class="flex items-center gap-2.5">
						<button
							type="button"
							onclick={() => (composeOpen = false)}
							class="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={Boolean(sendNewsletter.pending)}
							class="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-all hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if sendNewsletter.pending}
								<Loader size={14} class="animate-spin" />
								<span>Sending...</span>
							{:else}
								<Send size={14} />
								<span>
									{selectedEmails.length > 0
										? `Send to ${selectedEmails.length} Selected`
										: `Send to All (${subscribers.length})`}
								</span>
							{/if}
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Bulk Delete Confirmation Dialog -->
<Dialog.Root open={bulkDeleteOpen} onOpenChange={(v: boolean) => (bulkDeleteOpen = v)}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete {selectedIds.length} subscribers?</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to permanently remove <strong>{selectedIds.length}</strong> selected
				subscriber{selectedIds.length === 1 ? '' : 's'} from your newsletter list? This action
				cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-2">
			<button
				type="button"
				onclick={() => (bulkDeleteOpen = false)}
				class="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
			>
				Cancel
			</button>
			<button
				type="button"
				disabled={deleting}
				onclick={handleBulkDeleteConfirmed}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
			>
				{#if deleting}
					<Loader size={14} class="animate-spin" />
					<span>Removing...</span>
				{:else}
					Delete {selectedIds.length}
				{/if}
			</button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Single Delete Confirmation Dialog -->
<Dialog.Root open={confirmOpen} onOpenChange={(v: boolean) => (confirmOpen = v)}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Remove subscriber?</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to remove <strong>{pendingDelete?.email}</strong> from your newsletter
				list? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="flex gap-2">
			<button
				type="button"
				onclick={() => (confirmOpen = false)}
				class="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
			>
				Cancel
			</button>
			<button
				type="button"
				disabled={deleting}
				onclick={handleDeleteConfirmed}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
			>
				{#if deleting}
					<Loader size={14} class="animate-spin" />
					<span>Removing...</span>
				{:else}
					Yes, remove
				{/if}
			</button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
