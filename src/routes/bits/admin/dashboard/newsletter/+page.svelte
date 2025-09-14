<script lang="ts">
	import {
	  Search,
	  Filter,
	  Mail as MailIcon,
	  Send,
	  Download,
	  Trash2,
	  UserPlus
	} from 'lucide-svelte';
  
	// state (runes)
	let { data } = $props();
	let subscribers = $state(data?.subscribers || []);
	
	let query = $state('');
  
	let selected = $state<Record<string, boolean>>({});
	let subject = $state('');
	let message = $state('');
	let sending = $state(false);
	let statusMessage = $state('');
  
	// derived values
	let filtered = $derived(
	  subscribers.filter((s: any) => {
		const hay = `${s.email}`.toLowerCase();
		const matchesQuery = hay.includes(query.toLowerCase());
		return matchesQuery;
	  })
	);
  
	let selectedList = $derived(Object.keys(selected).filter((id) => selected[id]));
  
	function toggleSelect(id: string) {
	  selected = { ...selected, [id]: !selected[id] };
	}
  
	function selectAll() {
	  const allSelected = filtered.every((s) => selected[s.id]);
	  if (allSelected) {
		const next = { ...selected };
		filtered.forEach((s) => delete next[s.id]);
		selected = next;
	  } else {
		const next = { ...selected };
		filtered.forEach((s) => (next[s.id] = true));
		selected = next;
	  }
	}
  
	function handleUnsubscribe(ids: string[]) {
	  if (!confirm(`Unsubscribe ${ids.length} user(s)?`)) return;
	  subscribers = subscribers.map((s) =>
		ids.includes(s.id) ? { ...s, subscribed: false } : s
	  );
	  const next = { ...selected };
	  ids.forEach((id) => delete next[id]);
	  selected = next;
	  statusMessage = `${ids.length} subscriber(s) unsubscribed`;
	  setTimeout(() => (statusMessage = ''), 3000);
	}
  
	async function handleSend(toAll = false) {
	  const targets = toAll
		? subscribers.filter((s) => s.subscribed)
		: subscribers.filter((s) => selected[s.id]);
  
	  if (targets.length === 0) {
		statusMessage = 'No recipients selected';
		setTimeout(() => (statusMessage = ''), 2000);
		return;
	  }
	  if (!subject.trim() || !message.trim()) {
		statusMessage = 'Please provide subject and message';
		setTimeout(() => (statusMessage = ''), 2000);
		return;
	  }
	  sending = true;
	  statusMessage = 'Sending...';
	  await new Promise((r) => setTimeout(r, 1200));
	  const now = new Date().toISOString();
	  subscribers = subscribers.map((s) =>
		targets.some((t) => t.id === s.id) ? { ...s, lastSentAt: now } : s
	  );
	  sending = false;
	  statusMessage = `Sent to ${targets.length} subscriber(s)`;
	  setTimeout(() => (statusMessage = ''), 3000);
	}

</script>

<div class="space-y-6">
	<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
		<div>
		<h1 class="text-2xl font-cabinet font-medium text-brand-grey-500">Newsletter</h1>
		<p class="text-brand-grey-400 font-synonym">Manage subscribers and send newsletter broadcasts</p>
		</div>
	</div>

	<div class="bg-white rounded-xl p-6 border border-brand-grey-50">
		<div class="flex-1 relative">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey-400 h-4 w-4" />
			<input
			type="text"
			placeholder="Search subscribers..."
			value={query}
			class="w-full pl-10 pr-4 py-2 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
			/>
		</div>
	</div>

	<div class="bg-white rounded-xl border border-brand-grey-50 overflow-hidden">
		<div class="bg-bg-blue px-6 py-4 border-b border-brand-grey-50">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
				<input
					type="checkbox"
					checked={filtered.length > 0 && filtered.every((s) => selected[s.id])}
					onchange={selectAll}
					class="rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
				/>
				<span class="text-sm font-synonym font-medium text-brand-grey-500">{filtered.length} Subscribers</span>
				</div>

				<div class="flex items-center gap-2">
				<button
					onclick={() => handleSend(true)}
					class="flex items-center gap-2 bg-brand-orange-500 text-white px-3 py-2 rounded-lg text-sm font-synonym hover:bg-brand-orange-500/90 transition-colors"
					title="Send to all subscribed"
				>
					<Send size={14} />
					Send to All
				</button>

				{#if selectedList.length > 0 }
					<button
						onclick={() => handleSend(false)}
						class="flex items-center gap-2 bg-brand-blue-500 text-white px-3 py-2 rounded-lg text-sm font-synonym hover:bg-brand-blue-500/90 transition-colors"
						title="Send to selected"
					>
						<Send size={14} />
						Send to Selected ({selectedList.length})
					</button>

					<button
						onclick={() => handleUnsubscribe(selectedList)}
						class="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-synonym hover:bg-red-50 transition-colors"
						title="Unsubscribe selected"
					>
						<Trash2 size={14} />
						Unsubscribe
					</button>
				{/if}
				</div>
			</div>
		</div>

		<div class="divide-y divide-brand-grey-50">
			{#if filtered.length === 0 }
				<div class="p-12 text-center">
					<MailIcon class="mx-auto h-12 w-12 text-brand-grey-200 mb-4" />
					<h3 class="text-lg font-cabinet font-medium text-brand-grey-500 mb-2">No subscribers found</h3>
					<p class="text-brand-grey-400 font-synonym">Invite users or import a CSV to populate your subscriber list</p>
				</div>
			{:else}
				{#each filtered as s}
					<div  class="p-4 hover:bg-bg-blue transition-colors flex items-start gap-4">
						<div class="flex items-center">
						<input
							type="checkbox"
							checked={!!selected[s.id]}
							onchange={() => toggleSelect(s.id)}
							class="rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0 mt-1"
						/>
						</div>

						<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-4">
							<div class="min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="font-cabinet text-brand-grey-500">{s.name ?? s.email}</span>
								<span class="text-xs text-brand-grey-400 font-synonym">{s.email}</span>
							</div>
							<div class="flex items-center gap-2 text-xs text-brand-grey-400 font-synonym">
								<span>Joined: {new Date(s.joinedAt).toLocaleDateString()}</span>
								<span>•</span>
								<!-- <span class={`px-2 py-0.5 rounded-full text-xs ${s.subscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.subscribed ? 'Subscribed' : 'Unsubscribed'}</span>
								{s.lastSentAt && <><span>•</span><span class="text-xs">Last sent: {new Date(s.lastSentAt).toLocaleString()}</span></>} -->
							</div>
							</div>

							<div class="flex items-center gap-2">
							<button
								onclick={() => handleUnsubscribe([s.id])}
								class="p-2 text-brand-grey-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
								title="Unsubscribe user"
							>
								<Trash2 size={16} />
							</button>
							<button
								onclick={() => { }}
								class="p-2 text-brand-grey-400 hover:text-brand-blue-500 hover:bg-brand-blue-50 rounded-lg transition-colors"
								title="Send to this user"
							>
								<Send size={16} />
							</button>
							</div>
						</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<!-- {/* Composer */} -->
	<div class="bg-white rounded-xl p-6 border border-brand-grey-50">
		<h3 class="font-cabinet font-medium text-brand-grey-500 mb-3">Compose Newsletter</h3>
		<div class="space-y-3">
		<input
			type="text"
			placeholder="Subject"
			value={subject}
			onchange={(e) => {}}
			class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
		/>
		<textarea
			placeholder="Write your message here..."
			value={message}
			onchange={(e) => {}}
			class="w-full min-h-[140px] p-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
		></textarea>

		<div class="flex items-center gap-2">
			<button
			onclick={() => handleSend(true)}
			disabled={sending}
			class="flex items-center gap-2 bg-brand-orange-500 text-white px-4 py-2 rounded-lg text-sm font-synonym hover:bg-brand-orange-500/90 transition-colors disabled:opacity-50"
			>
			<Send size={16} />
			Send to All Subscribed
			</button>

			<button
			onclick={() => handleSend(false)}
			disabled={sending || selectedList.length === 0}
			class="flex items-center gap-2 bg-brand-blue-500 text-white px-4 py-2 rounded-lg text-sm font-synonym hover:bg-brand-blue-500/90 transition-colors disabled:opacity-50"
			>
			<Send size={16} />
			Send to Selected ({selectedList.length})
			</button>

			<button
			onclick={() => {}}
			class="flex items-center gap-2 bg-white border border-brand-grey-50 px-4 py-2 rounded-lg text-sm font-synonym hover:bg-bg-blue transition-colors"
			>
			Clear
			</button>
		</div>

		{#if statusMessage}
			<div class="text-sm text-brand-grey-500 mt-2">{statusMessage}</div>
		{/if}
		</div>
	</div>
</div>

