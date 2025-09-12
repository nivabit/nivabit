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
  
	type Subscriber = {
	  id: string;
	  email: string;
	  name?: string;
	  subscribed: boolean;
	  joinedAt: string;
	  tags?: string[];
	  lastSentAt?: string;
	};
  
	type FilterState = 'All' | 'Subscribed' | 'Unsubscribed';
  
	// state (runes)
	let query = $state('');
	let filter = $state<FilterState>('All');
	let subscribers = $state<Subscriber[]>([
	  {
		id: 's1',
		email: 'jane.doe@example.com',
		name: 'Jane Doe',
		subscribed: true,
		joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
		tags: ['beta']
	  },
	  {
		id: 's2',
		email: 'michael.smith@example.com',
		name: 'Michael Smith',
		subscribed: true,
		joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
	  },
	  {
		id: 's3',
		email: 'aisha.bello@example.com',
		name: 'Aisha Bello',
		subscribed: false,
		joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
	  },
	  {
		id: 's4',
		email: 'sam.green@example.com',
		name: 'Sam Green',
		subscribed: true,
		joinedAt: new Date().toISOString()
	  }
	]);
  
	let selected = $state<Record<string, boolean>>({});
	let subject = $state('');
	let message = $state('');
	let sending = $state(false);
	let statusMessage = $state('');
  
	// derived values
	let filtered = $derived(
	  subscribers.filter((s) => {
		const hay = `${s.email} ${s.name ?? ''} ${(s.tags ?? []).join(' ')}`.toLowerCase();
		const matchesQuery = hay.includes(query.toLowerCase());
		const matchesFilter =
		  filter === 'All' ||
		  (filter === 'Subscribed' && s.subscribed) ||
		  (filter === 'Unsubscribed' && !s.subscribed);
		return matchesQuery && matchesFilter;
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
  
	function exportCSV(onlySubscribed = false) {
	  const rows = (onlySubscribed ? subscribers.filter((s) => s.subscribed) : subscribers).map(
		(s) => ({
		  email: s.email,
		  name: s.name ?? '',
		  subscribed: s.subscribed ? 'yes' : 'no',
		  joinedAt: s.joinedAt
		})
	  );
	  if (rows.length === 0) return;
	  const csv = [
		Object.keys(rows[0] || {}).join(','),
		...rows.map((r) =>
		  Object.values(r)
			.map((v) => `"${String(v).replace(/"/g, '""')}"`)
			.join(',')
		)
	  ].join('\n');
	  const blob = new Blob([csv], { type: 'text/csv' });
	  const url = URL.createObjectURL(blob);
	  const a = document.createElement('a');
	  a.href = url;
	  a.download = `subscribers_${onlySubscribed ? 'subscribed' : 'all'}.csv`;
	  document.body.appendChild(a);
	  a.click();
	  a.remove();
	  URL.revokeObjectURL(url);
	}
  
	function addSubscriber(email: string, name?: string) {
	  const id = `s${Math.random().toString(36).slice(2, 9)}`;
	  subscribers = [
		{ id, email, name, subscribed: true, joinedAt: new Date().toISOString() },
		...subscribers
	  ];
	}
  
	let addEmail = $state('');
	let addName = $state('');
</script>


<div class="space-y-6">
	<!-- Search + Filter -->
	<div class="bg-white rounded-xl p-6 border">
	<div class="flex gap-4">
		<div class="flex-1 relative">
		<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
		<input
			type="text"
			placeholder="Search subscribers..."
			bind:value={query}
			class="w-full pl-10 pr-4 py-2 border rounded-lg"
		/>
		</div>

		<div class="flex items-center gap-2">
		<Filter class="text-gray-400 h-4 w-4" />
		<select bind:value={filter} class="border rounded-lg px-3 py-2">
			<option value="All">All</option>
			<option value="Subscribed">Subscribed</option>
			<option value="Unsubscribed">Unsubscribed</option>
		</select>
		</div>
	</div>
	</div>

	<!-- Subscribers List -->
	<div class="bg-white rounded-xl border overflow-hidden">
	<div class="bg-gray-50 px-6 py-4 border-b">
		<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<input
			type="checkbox"
			checked={filtered.length > 0 && filtered.every((s) => selected[s.id])}
			onchange={selectAll}
			/>
			<span class="text-sm">{filtered.length} Subscribers</span>
		</div>
		<div class="flex gap-2">
			<button onclick={() => handleSend(true)} class="bg-orange-500 text-white px-3 py-2 rounded-lg">
			<Send size={14} /> Send to All
			</button>
		</div>
		</div>
	</div>

	{#if filtered.length === 0}
		<div class="p-12 text-center">
		<MailIcon class="mx-auto h-12 w-12 text-gray-300 mb-4" />
		<h3 class="text-lg font-medium text-gray-500 mb-2">No subscribers found</h3>
		<p class="text-gray-400">Invite users or import a CSV</p>
		</div>
	{:else}
		{#each filtered as s (s.id)}
		<div class="p-4 flex items-start gap-4 border-b">
			<input type="checkbox" checked={!!selected[s.id]} onchange={() => toggleSelect(s.id)} />
			<div class="flex-1">
			<div class="flex items-start justify-between">
				<div>
				<div class="flex items-center gap-2 mb-1">
					<span class="font-medium">{s.name ?? s.email}</span>
					<span class="text-xs text-gray-400">{s.email}</span>
				</div>
				<div class="text-xs text-gray-400 flex gap-2">
					<span>Joined: {new Date(s.joinedAt).toLocaleDateString()}</span>
					<span>•</span>
					<span class={s.subscribed ? 'text-green-600' : 'text-red-600'}>
					{s.subscribed ? 'Subscribed' : 'Unsubscribed'}
					</span>
					{#if s.lastSentAt}
					<span>•</span>
					<span>Last sent: {new Date(s.lastSentAt).toLocaleString()}</span>
					{/if}
				</div>
				</div>
				<div class="flex gap-2">
				<button onclick={() => handleUnsubscribe([s.id])}>
					<Trash2 size={16} />
				</button>
				<button
					onclick={() => {
					selected = { ...selected, [s.id]: true };
					handleSend(false);
					}}
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

	<!-- Status -->
	{#if statusMessage}
	<div class="text-sm text-gray-500">{statusMessage}</div>
	{/if}

	<!-- Add Subscriber -->
	<div class="bg-white rounded-xl p-6 border">
	<h3 class="font-medium text-gray-500 mb-3">Quick Add Subscriber</h3>
	<div class="flex gap-2">
		<input bind:value={addEmail} placeholder="Email" class="flex-1 border px-2 py-1 rounded" />
		<input bind:value={addName} placeholder="Name (optional)" class="w-60 border px-2 py-1 rounded" />
		<button
		onclick={() => {
			if (!addEmail.includes('@')) return alert('Please provide a valid email');
			addSubscriber(addEmail.trim(), addName.trim() || undefined);
			addEmail = '';
			addName = '';
			statusMessage = 'Subscriber added';
			setTimeout(() => (statusMessage = ''), 2000);
		}}
		class="bg-blue-500 text-white px-4 py-2 rounded"
		>
		<UserPlus size={16} /> Add
		</button>
	</div>
	</div>
</div>
  