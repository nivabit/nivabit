<script lang="ts">
	import { getPlatformMetrics, upsertPlatformMetric } from '#lib/remote/admin.remote.ts';
	import { updateMetricSchema } from '#lib/validation/validation.ts';
	import {
		TrendingUp,
		Plus,
		Save,
		Edit3,
		BarChart3,
		ShieldCheck,
		CheckCircle2,
		Layers
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let metrics = $derived(await getPlatformMetrics());

	let isEditing = $state<string | null>(null);
	let editKey = $state('');
	let editLabel = $state('');
	let editValue = $state('');
	let editChange = $state('');
	let editCategory = $state('growth');

	let showNewMetricForm = $state(false);
	let newKey = $state('');
	let newLabel = $state('');
	let newValue = $state('');
	let newChange = $state('');
	let newCategory = $state('growth');

	function startEdit(metric: any) {
		isEditing = metric.id;
		editKey = metric.key;
		editLabel = metric.label;
		editValue = metric.value;
		editChange = metric.change || '';
		editCategory = metric.category || 'growth';
	}

	function cancelEdit() {
		isEditing = null;
	}

	async function saveEdit() {
		try {
			await upsertPlatformMetric({
				key: editKey,
				label: editLabel,
				value: editValue,
				change: editChange,
				category: editCategory
			});
			toast.success(`Metric "${editLabel}" saved!`);
			isEditing = null;
			await getPlatformMetrics().refresh();
		} catch (err: any) {
			toast.error(err?.message || 'Failed to update metric');
		}
	}

	async function createNewMetric() {
		if (!newKey || !newLabel || !newValue) {
			toast.error('Key, Label and Value are required');
			return;
		}

		try {
			await upsertPlatformMetric({
				key: newKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
				label: newLabel.trim(),
				value: newValue.trim(),
				change: newChange.trim(),
				category: newCategory
			});
			toast.success(`Created metric "${newLabel}"`);
			showNewMetricForm = false;
			newKey = '';
			newLabel = '';
			newValue = '';
			newChange = '';
			await getPlatformMetrics().refresh();
		} catch (err: any) {
			toast.error(err?.message || 'Failed to create metric');
		}
	}
</script>

<svelte:head>
	<title>Platform Metrics | Nivabit CEO</title>
</svelte:head>

<section class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<span class="h-2 w-2 rounded-[1.5px] bg-[#0284c7]"></span>
				<span class="font-mono text-xs font-bold tracking-wider text-[#0284c7] uppercase">
					Platform Performance
				</span>
			</div>
			<h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
				Platform &amp; Proof Metrics
			</h1>
			<p class="text-xs text-slate-500">
				Manage the public traction numbers, validation track record, and proof signals shown across Nivabit.
			</p>
		</div>

		<button
			type="button"
			onclick={() => (showNewMetricForm = !showNewMetricForm)}
			class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0284c7] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#0284c7]/20 transition-all hover:bg-[#0369a1]"
		>
			<Plus class="h-3.5 w-3.5" />
			{showNewMetricForm ? 'Close Form' : 'Add New Metric'}
		</button>
	</div>

	<!-- Add New Metric Drawer / Box -->
	{#if showNewMetricForm}
		<div class="rounded-2xl border border-sky-100 bg-sky-50/50 p-6 shadow-xs">
			<h3 class="text-sm font-bold text-slate-900">Add New Platform Metric</h3>
			<p class="text-xs text-slate-500">Create a new key metric to track and display on the platform.</p>

			<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<label class="mb-1 block text-[11px] font-bold text-slate-700">Metric Key (unique_id)</label>
					<input
						type="text"
						bind:value={newKey}
						placeholder="e.g. client_nps"
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#0284c7] focus:outline-none"
					/>
				</div>
				<div>
					<label class="mb-1 block text-[11px] font-bold text-slate-700">Display Label</label>
					<input
						type="text"
						bind:value={newLabel}
						placeholder="e.g. Founder Net Promoter Score"
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#0284c7] focus:outline-none"
					/>
				</div>
				<div>
					<label class="mb-1 block text-[11px] font-bold text-slate-700">Value</label>
					<input
						type="text"
						bind:value={newValue}
						placeholder="e.g. 98/100 or 80%+"
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#0284c7] focus:outline-none"
					/>
				</div>
				<div>
					<label class="mb-1 block text-[11px] font-bold text-slate-700">Change / Trend</label>
					<input
						type="text"
						bind:value={newChange}
						placeholder="e.g. +14% QoQ or Top 1%"
						class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#0284c7] focus:outline-none"
					/>
				</div>
			</div>

			<div class="mt-4 flex justify-end gap-2">
				<button
					type="button"
					onclick={() => (showNewMetricForm = false)}
					class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={createNewMetric}
					class="rounded-xl bg-[#0284c7] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0369a1]"
				>
					Save Metric
				</button>
			</div>
		</div>
	{/if}

	<!-- Metrics Cards Grid -->
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
		{#each metrics as m}
			<div class="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
				{#if isEditing === m.id}
					<div class="space-y-3">
						<div>
							<label class="text-[10px] font-bold text-slate-500 uppercase">Label</label>
							<input
								type="text"
								bind:value={editLabel}
								class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-bold"
							/>
						</div>
						<div>
							<label class="text-[10px] font-bold text-slate-500 uppercase">Value</label>
							<input
								type="text"
								bind:value={editValue}
								class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm font-black text-[#0284c7]"
							/>
						</div>
						<div>
							<label class="text-[10px] font-bold text-slate-500 uppercase">Trend / Change</label>
							<input
								type="text"
								bind:value={editChange}
								class="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700"
							/>
						</div>
						<div class="flex items-center gap-2 pt-2">
							<button
								type="button"
								onclick={saveEdit}
								class="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#0284c7] py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0369a1]"
							>
								<Save class="h-3 w-3" />
								Save
							</button>
							<button
								type="button"
								onclick={cancelEdit}
								class="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
							>
								Cancel
							</button>
						</div>
					</div>
				{:else}
					<div>
						<div class="flex items-center justify-between">
							<span class="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0284c7] uppercase">
								{m.category || 'Metric'}
							</span>
							<button
								type="button"
								onclick={() => startEdit(m)}
								class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
								title="Edit metric"
							>
								<Edit3 class="h-3.5 w-3.5" />
							</button>
						</div>

						<h3 class="mt-4 text-3xl font-black tracking-tight text-slate-900">
							{m.value}
						</h3>
						<p class="mt-1 text-xs font-semibold text-slate-600">
							{m.label}
						</p>
					</div>

					<div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
						<span class="font-bold text-emerald-600">
							{m.change || 'Live verified'}
						</span>
						<span class="font-mono text-slate-400">
							{m.key}
						</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
