<script lang="ts">
	import type { contactType } from '$lib/mail_sender';
	import {
		Search,
		Filter,
		ChevronDown,
		ChevronRight,
		Send,
		CheckCircle2,
		Eye,
		Trash2,
		MailOpen,
		Mail as MailIcon
	} from '@lucide/svelte';

	interface ContactMessage extends contactType {
		id: string;
		receivedAt: string;
		read: boolean;
		replied?: boolean;
		replyHistory?: { date: string; content: string }[];
	}

	type StatusFilter = 'All' | 'Unread' | 'Read' | 'Replied';

	let { data } = $props();
	let searchTerm = $state('');
	let statusFilter: StatusFilter = $state('All');
	let expanded: Record<string, boolean> = $state({});
	let draftReplies: Record<string, string> = $state({});
	let selectedMessage: ContactMessage | null = $state(null);

	let messages: ContactMessage[] = $derived(
		(data?.contact ?? []).map((m: any) => ({
			id: m.id,
			name: m.name,
			services: m.services,
			email: m.email,
			subject: m.subject,
			message: m.message,
			receivedAt: m.createdAt, // map createdAt → receivedAt
			read: m.isread, // map isread → read
			replied: false, // default until replies are stored
			replyHistory: [] // empty until replies exist
		}))
	);

	// derived filtered messages
	let filteredMessages = $derived(
		messages.filter((m) => {
			const haystack =
				`${m.name} ${m.email} ${m.subject} ${m.message ?? ''} ${m.services ?? ''}`.toLowerCase();
			const matchesSearch = haystack.includes(searchTerm.toLowerCase());
			const matchesStatus =
				statusFilter === 'All' ||
				(statusFilter === 'Unread' && !m.read) ||
				(statusFilter === 'Read' && m.read) ||
				(statusFilter === 'Replied' && m.replied === true);
			return matchesSearch && matchesStatus;
		})
	);

	function toggleExpand(id: string) {
		expanded = { ...expanded, [id]: !expanded[id] };
	}

	function openMessageModal(m: ContactMessage) {
		selectedMessage = m;
		// mark as read when opened
		messages = messages.map((msg) => (msg.id === m.id ? { ...msg, read: true } : msg));
	}

	function closeMessageModal() {
		selectedMessage = null;
	}

	function handleDelete(id: string) {
		if (confirm('Delete this message?')) {
			messages = messages.filter((m) => m.id !== id);
		}
	}

	function handleSendReply(id: string) {
		const content = draftReplies[id]?.trim();
		if (!content) return;
		messages = messages.map((m) =>
			m.id === id
				? {
						...m,
						read: true,
						replied: true,
						replyHistory: [...(m.replyHistory ?? []), { date: new Date().toISOString(), content }]
					}
				: m
		);
		draftReplies = { ...draftReplies, [id]: '' };
	}

	function setReadAll() {
		messages = messages.map((m) => ({ ...m, read: true }));
	}

	function messageStatusBadge(m: ContactMessage) {
		if (m.replied)
			return `<span class="px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700">Replied</span>`;
		if (m.read)
			return `<span class="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700">Read</span>`;
		return `<span class="px-2.5 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Unread</span>`;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
		<div>
			<h1 class="font-cabinet text-2xl font-medium text-brand-grey-500">Contact Messages</h1>
			<p class="font-synonym text-brand-grey-400">View, reply, and manage contact form messages</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={setReadAll}
				class="font-synonym flex items-center gap-2 rounded-lg bg-brand-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-brand-blue-500/90"
			>
				<CheckCircle2 size={16} />
				Mark all as read
			</button>
		</div>
	</div>

	<!-- Search + Filter -->
	<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
		<div class="flex flex-col gap-4 lg:flex-row">
			<div class="relative flex-1">
				<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand-grey-400" />
				<input
					type="text"
					placeholder="Search messages..."
					bind:value={searchTerm}
					class="font-synonym w-full rounded-lg border border-brand-grey-50 py-2 pr-4 pl-10 placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
				/>
			</div>

			<div class="flex items-center gap-2">
				<Filter class="h-4 w-4 text-brand-grey-400" />
				<select
					bind:value={statusFilter}
					class="font-synonym rounded-lg border border-brand-grey-50 px-3 py-2 text-brand-grey-500 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
				>
					<option value="All">All</option>
					<option value="Unread">Unread</option>
					<option value="Read">Read</option>
					<option value="Replied">Replied</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Messages list -->
	<div class="overflow-hidden rounded-xl border border-brand-grey-50 bg-white">
		<div class="border-b border-brand-grey-50 bg-bg-blue px-6 py-4">
			<div class="flex items-center justify-between">
				<span class="font-synonym text-sm font-medium text-brand-grey-500"
					>{filteredMessages.length} Messages</span
				>
			</div>
		</div>

		<div class="divide-y divide-brand-grey-50">
			{#if filteredMessages.length === 0}
				<div class="p-12 text-center">
					<MailIcon class="mx-auto mb-4 h-12 w-12 text-brand-grey-200" />
					<h3 class="font-cabinet mb-2 text-lg font-medium text-brand-grey-500">
						No messages found
					</h3>
					<p class="font-synonym text-brand-grey-400">Try different search or filter criteria</p>
				</div>
			{:else}
				{#each filteredMessages as m (m.id)}
					<div class="p-0">
						<!-- Row -->
						<div class="p-6 transition-colors hover:bg-bg-blue">
							<div class="flex items-start gap-4">
								<button
									class="mt-1 rounded-lg p-1 text-brand-grey-400 hover:bg-brand-grey-50 hover:text-brand-grey-600"
									onclick={() => toggleExpand(m.id)}
								>
									{#if expanded[m.id]}
										<ChevronDown size={18} />
									{:else}
										<ChevronRight size={18} />
									{/if}
								</button>

								<div class="min-w-0 flex-1">
									<div class="flex items-start justify-between gap-4">
										<div class="min-w-0">
											<div class="mb-1 flex items-center gap-2">
												<span class="font-cabinet text-brand-grey-500">{m.name}</span>
												<span class="text-brand-grey-300">•</span>
												<span class="font-synonym text-sm text-brand-grey-400">{m.email}</span>
											</div>
											<div
												class="font-synonym mb-2 flex items-center gap-2 text-xs text-brand-grey-400"
											>
												{#if m.services}
													<span class="rounded-full bg-brand-grey-50 px-2 py-1 text-brand-grey-500"
														>{m.services}</span
													>
												{/if}
												<span class="flex items-center gap-1"
													><Eye size={12} /> {new Date(m.receivedAt).toLocaleString()}</span
												>
											</div>
											<p
												class="font-synonym text-sm text-brand-grey-500 {expanded[m.id]
													? ''
													: 'line-clamp-1'}"
											>
												{m.subject}
											</p>
										</div>

										<div class="flex items-center gap-2">
											{@html messageStatusBadge(m)}
											<button
												onclick={() => openMessageModal(m)}
												class="rounded-lg p-2 text-brand-grey-400 transition-colors hover:bg-brand-blue-50 hover:text-brand-blue-500"
											>
												<MailOpen size={16} />
											</button>
											<button
												onclick={() => toggleExpand(m.id)}
												class="rounded-lg p-2 text-brand-grey-400 transition-colors hover:bg-brand-blue-50 hover:text-brand-blue-500"
											>
												<Eye size={16} />
											</button>
											<button
												onclick={() => handleDelete(m.id)}
												class="rounded-lg p-2 text-brand-grey-400 transition-colors hover:bg-red-50 hover:text-red-500"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Expanded details -->
						{#if expanded[m.id]}
							<div class="px-6 pb-6">
								<div class="rounded-xl border border-brand-grey-50 bg-bg-blue">
									<div class="p-4">
										<h4 class="font-cabinet mb-2 text-brand-grey-500">Message</h4>
										<p class="font-synonym text-sm whitespace-pre-wrap text-brand-grey-600">
											{m.message || 'No message body provided.'}
										</p>
									</div>

									{#if m.replyHistory?.length}
										<div class="px-4 pb-4">
											<h4 class="font-cabinet mb-2 text-brand-grey-500">Previous Replies</h4>
											<div class="space-y-3">
												{#each m.replyHistory as r, idx}
													<div class="rounded-lg border border-brand-grey-50 bg-white p-3">
														<div class="font-synonym mb-1 text-xs text-brand-grey-400">
															{new Date(r.date).toLocaleString()}
														</div>
														<div
															class="font-synonym text-sm whitespace-pre-wrap text-brand-grey-600"
														>
															{r.content}
														</div>
													</div>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Reply box -->
									<div class="rounded-b-xl border-t border-brand-grey-50 bg-white p-4">
										<div class="flex items-start gap-3">
											<div class="flex-1">
												<textarea
													bind:value={draftReplies[m.id]}
													placeholder={`Reply to ${m.name} (${m.email})...`}
													class="font-synonym min-h-[100px] w-full rounded-lg border border-brand-grey-100 p-3 text-sm placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
												></textarea>
											</div>
											<button
												onclick={() => handleSendReply(m.id)}
												disabled={!draftReplies[m.id]?.trim()}
												class="font-synonym flex items-center gap-2 rounded-lg bg-brand-orange-500 px-4 py-2 text-sm text-white transition-colors hover:bg-brand-orange-500/90 disabled:opacity-50"
											>
												<Send size={16} />
												Send
											</button>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
