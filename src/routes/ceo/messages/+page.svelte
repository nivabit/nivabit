<script lang="ts">
	import type { contactType } from '#lib/types/contact.type.ts';
	import {
		getContacts,
		deleteContactsBulk,
		markContactsRead,
		markAllContactsRead,
		replyToContact
	} from '#lib/remote/contact.remote.ts';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import {
		Search,
		Filter,
		ChevronDown,
		ChevronRight,
		ChevronLeft,
		Send,
		CheckCircle2,
		Eye,
		Trash2,
		Mail as MailIcon,
		ShieldAlert,
		Loader
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface ContactMessage extends contactType {
		id: string;
		receivedAt: string;
		read: boolean;
	}

	type StatusFilter = 'All' | 'Unread' | 'Read';

	const PAGE_SIZE = 10;

	const SPAM_DOMAINS = new Set([
		'jmailservice.com',
		'dominatingkeywords.com',
		'dominatebanners.com',
		'aeroleads.com',
		'mailinator.com',
		'guerrillamail.com',
		'tempmail.com',
		'10minutemail.com',
		'yopmail.com'
	]);

	function looksLikeSpam(m: ContactMessage): boolean {
		const email = (m.email || '').trim().toLowerCase();
		const [local = '', domain = ''] = email.split('@');
		if (SPAM_DOMAINS.has(domain)) return true;
		if ((domain === 'gmail.com' || domain === 'googlemail.com') && (local.match(/\./g)?.length ?? 0) >= 4) {
			return true;
		}
		for (const token of (m.name || '').trim().split(/\s+/)) {
			if (token.length < 10) continue;
			let switches = 0;
			for (let i = 1; i < token.length; i++) {
				const prevU = token[i - 1] >= 'A' && token[i - 1] <= 'Z';
				const currU = token[i] >= 'A' && token[i] <= 'Z';
				const prevL = token[i - 1] >= 'a' && token[i - 1] <= 'z';
				const currL = token[i] >= 'a' && token[i] <= 'z';
				if ((prevU && currL) || (prevL && currU)) switches++;
			}
			if (switches >= 5 || /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(token)) return true;
		}
		return false;
	}

	let rawContacts = $derived(await getContacts());
	let searchTerm = $state('');
	let statusFilter: StatusFilter = $state('All');
	let currentPage = $state(1);

	let selected = $state<Record<string, boolean>>({});
	let expanded = $state<Record<string, boolean>>({});
	let draftReplies = $state<Record<string, string>>({});
	let sendingReplyId = $state<string | null>(null);

	let bulkDeleteOpen = $state(false);
	let busy = $state(false);

	let messages: ContactMessage[] = $derived(
		(rawContacts ?? []).map((m: any) => ({
			id: m.id,
			name: m.name,
			services: m.services,
			email: m.email,
			subject: m.subject,
			message: m.message,
			receivedAt: m.createdAt,
			read: Boolean(m.isread)
		}))
	);

	let spamIds = $derived(messages.filter(looksLikeSpam).map((m) => m.id));

	let filteredMessages = $derived(
		messages.filter((m) => {
			const haystack =
				`${m.name} ${m.email} ${m.subject} ${m.message ?? ''} ${m.services ?? ''}`.toLowerCase();
			const matchesSearch = haystack.includes(searchTerm.trim().toLowerCase());
			const matchesStatus =
				statusFilter === 'All' ||
				(statusFilter === 'Unread' && !m.read) ||
				(statusFilter === 'Read' && m.read);
			return matchesSearch && matchesStatus;
		})
	);

	let totalPages = $derived(Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE)));

	$effect(() => {
		searchTerm;
		statusFilter;
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	let paginatedMessages = $derived(
		filteredMessages.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
	);

	let selectedIds = $derived(messages.filter((m) => selected[m.id]).map((m) => m.id));

	function toggleSelect(id: string) {
		selected = { ...selected, [id]: !selected[id] };
	}

	function toggleSelectPage() {
		const allOnPage =
			paginatedMessages.length > 0 && paginatedMessages.every((m) => selected[m.id]);
		const next = { ...selected };
		for (const m of paginatedMessages) {
			if (allOnPage) delete next[m.id];
			else next[m.id] = true;
		}
		selected = next;
	}

	function selectAllFiltered() {
		const next: Record<string, boolean> = {};
		for (const m of filteredMessages) {
			next[m.id] = true;
		}
		selected = next;
	}

	function selectDetectedSpam() {
		if (spamIds.length === 0) {
			toast.info('No obvious spam messages detected.');
			return;
		}
		const next: Record<string, boolean> = {};
		for (const id of spamIds) {
			next[id] = true;
		}
		selected = next;
		toast.success(`Selected ${spamIds.length} detected spam messages. Click Delete to remove.`);
	}

	function toggleExpand(m: ContactMessage) {
		const willExpand = !expanded[m.id];
		expanded = { ...expanded, [m.id]: willExpand };
		if (willExpand && !m.read) {
			markContactsRead({ ids: [m.id] }).catch(() => {});
		}
	}

	async function handleDeleteSingle(id: string) {
		if (!confirm('Delete this message permanently?')) return;
		busy = true;
		try {
			await deleteContactsBulk({ ids: [id] });
			const next = { ...selected };
			delete next[id];
			selected = next;
			toast.success('Message deleted');
		} catch (err: any) {
			toast.error(err?.message || 'Failed to delete message');
		} finally {
			busy = false;
		}
	}

	async function handleBulkDeleteConfirmed() {
		if (selectedIds.length === 0) return;
		busy = true;
		try {
			const res = await deleteContactsBulk({ ids: selectedIds });
			selected = {};
			bulkDeleteOpen = false;
			toast.success(res.message);
		} catch (err: any) {
			toast.error(err?.message || 'Failed to delete selected messages');
		} finally {
			busy = false;
		}
	}

	async function handleBulkMarkRead() {
		if (selectedIds.length === 0) return;
		busy = true;
		try {
			await markContactsRead({ ids: selectedIds });
			selected = {};
			toast.success(`Marked ${selectedIds.length} as read`);
		} catch (err: any) {
			toast.error(err?.message || 'Failed to mark messages as read');
		} finally {
			busy = false;
		}
	}

	async function handleMarkAllRead() {
		busy = true;
		try {
			await markAllContactsRead();
			toast.success('All messages marked as read');
		} catch (err: any) {
			toast.error(err?.message || 'Failed to mark all as read');
		} finally {
			busy = false;
		}
	}

	async function handleSendReply(m: ContactMessage) {
		const content = draftReplies[m.id]?.trim();
		if (!content) return;
		sendingReplyId = m.id;
		try {
			const res = await replyToContact({ id: m.id, message: content });
			draftReplies = { ...draftReplies, [m.id]: '' };
			toast.success(res.message);
		} catch (err: any) {
			toast.error(err?.message || 'Failed to send reply');
		} finally {
			sendingReplyId = null;
		}
	}
</script>

<svelte:head>
	<title>Inquiries & Leads | Nivabit CEO</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<span class="h-2 w-2 rounded-[1.5px] bg-[#2563eb]"></span>
				<span class="font-mono text-xs font-bold tracking-wider text-[#2563eb] uppercase">
					Lead Inbox
				</span>
			</div>
			<h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
				Contact Messages
			</h1>
			<p class="text-xs text-slate-500">View, reply, and manage contact form inquiries.</p>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			{#if spamIds.length > 0}
				<button
					type="button"
					onclick={selectDetectedSpam}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
				>
					<ShieldAlert size={14} />
					Select Spam ({spamIds.length})
				</button>
			{/if}

			<button
				type="button"
				disabled={busy}
				onclick={handleMarkAllRead}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-colors hover:bg-[#1d4ed8] disabled:opacity-50"
			>
				<CheckCircle2 size={14} />
				Mark All Read
			</button>
		</div>
	</div>

	<!-- Search + Filter -->
	<div
		class="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
	>
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				placeholder="Search by name, email, service, or message..."
				bind:value={searchTerm}
				oninput={() => (currentPage = 1)}
				class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
			/>
		</div>

		<div class="flex items-center gap-2">
			<Filter class="h-4 w-4 text-slate-400" />
			<select
				bind:value={statusFilter}
				onchange={() => (currentPage = 1)}
				aria-label="Filter by status"
				class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
			>
				<option value="All">All ({messages.length})</option>
				<option value="Unread">Unread ({messages.filter((m) => !m.read).length})</option>
				<option value="Read">Read ({messages.filter((m) => m.read).length})</option>
			</select>
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
				{#if selectedIds.length < filteredMessages.length}
					<button
						type="button"
						onclick={selectAllFiltered}
						class="cursor-pointer font-bold text-[#2563eb] underline underline-offset-2 hover:text-[#1d4ed8]"
					>
						Select all {filteredMessages.length}
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
					disabled={busy}
					onclick={handleBulkMarkRead}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
				>
					<CheckCircle2 size={13} />
					Mark Read
				</button>
				<button
					type="button"
					disabled={busy}
					onclick={() => (bulkDeleteOpen = true)}
					class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
				>
					<Trash2 size={13} />
					Delete ({selectedIds.length})
				</button>
			</div>
		</div>
	{/if}

	<!-- Messages List + Pagination -->
	<div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
		<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
			<label class="flex cursor-pointer items-center gap-3 text-xs font-semibold text-slate-700">
				<input
					type="checkbox"
					checked={paginatedMessages.length > 0 &&
						paginatedMessages.every((m) => selected[m.id])}
					onchange={toggleSelectPage}
					class="h-4 w-4 rounded accent-[#2563eb]"
				/>
				<span>Select page ({filteredMessages.length} total)</span>
			</label>
			<span class="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
		</div>

		<div class="divide-y divide-slate-100">
			{#if paginatedMessages.length === 0}
				<div class="p-12 text-center">
					<MailIcon class="mx-auto mb-3 h-10 w-10 text-slate-300" />
					<h3 class="text-sm font-bold text-slate-800">No messages found</h3>
					<p class="mt-1 text-xs text-slate-400">Try a different search or filter.</p>
				</div>
			{:else}
				{#each paginatedMessages as m (m.id)}
					{@const isSpam = looksLikeSpam(m)}
					<div>
						<div class="p-4 transition-colors hover:bg-slate-50/60 sm:px-5">
							<div class="flex items-start gap-3">
								<input
									type="checkbox"
									checked={!!selected[m.id]}
									onchange={() => toggleSelect(m.id)}
									class="mt-1.5 h-4 w-4 shrink-0 rounded accent-[#2563eb]"
								/>

								<button
									type="button"
									class="mt-0.5 shrink-0 cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
									onclick={() => toggleExpand(m)}
									aria-label="Toggle message details"
								>
									{#if expanded[m.id]}
										<ChevronDown size={16} />
									{:else}
										<ChevronRight size={16} />
									{/if}
								</button>

								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-start justify-between gap-3">
										<div class="min-w-0">
											<div class="flex flex-wrap items-center gap-2">
												<span class="truncate text-sm font-bold text-slate-900">{m.name}</span>
												<span class="text-xs text-slate-500">{m.email}</span>
												{#if isSpam}
													<span
														class="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase"
													>
														Likely Spam
													</span>
												{/if}
											</div>
											<div class="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
												{#if m.services}
													<span class="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
														{m.services}
													</span>
												{/if}
												<span>{new Date(m.receivedAt).toLocaleString()}</span>
											</div>
											<p
												class="mt-1.5 text-xs text-slate-600 {expanded[m.id] ? '' : 'line-clamp-1'}"
											>
												{m.message || m.subject}
											</p>
										</div>

										<div class="flex shrink-0 items-center gap-2">
											<span
												class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold {m.read
													? 'bg-blue-50 text-[#2563eb]'
													: 'bg-amber-50 text-amber-700'}"
											>
												{m.read ? 'Read' : 'Unread'}
											</span>
											<button
												type="button"
												onclick={() => toggleExpand(m)}
												class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
												title="View & reply"
											>
												<Eye size={14} />
											</button>
											<button
												type="button"
												disabled={busy}
												onclick={() => handleDeleteSingle(m.id)}
												class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
												title="Delete message"
											>
												<Trash2 size={14} />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Expanded details & reply -->
						{#if expanded[m.id]}
							<div class="border-t border-slate-100 bg-slate-50/70 px-5 py-4 pl-14">
								<p class="mb-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
									Message
								</p>
								<p class="text-sm whitespace-pre-wrap text-slate-700">
									{m.message || 'No message body provided.'}
								</p>

								<div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start">
									<textarea
										bind:value={draftReplies[m.id]}
										rows={3}
										placeholder={`Reply to ${m.name} (${m.email})...`}
										class="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
									></textarea>
									<button
										type="button"
										onclick={() => handleSendReply(m)}
										disabled={!draftReplies[m.id]?.trim() || sendingReplyId === m.id}
										class="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
									>
										{#if sendingReplyId === m.id}
											<Loader size={14} class="animate-spin" />
											Sending...
										{:else}
											<Send size={14} />
											Send Reply
										{/if}
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Pagination Footer -->
		{#if filteredMessages.length > PAGE_SIZE}
			<div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3">
				<p class="text-xs text-slate-500">
					Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(
						currentPage * PAGE_SIZE,
						filteredMessages.length
					)} of {filteredMessages.length}
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

<!-- Bulk Delete Confirmation Dialog -->
<Dialog.Root open={bulkDeleteOpen} onOpenChange={(v: boolean) => (bulkDeleteOpen = v)}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete {selectedIds.length} messages?</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to permanently delete <strong>{selectedIds.length}</strong> selected
				contact message{selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.
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
				disabled={busy}
				onclick={handleBulkDeleteConfirmed}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
			>
				{#if busy}
					<Loader size={14} class="animate-spin" />
					<span>Deleting...</span>
				{:else}
					Delete {selectedIds.length}
				{/if}
			</button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
