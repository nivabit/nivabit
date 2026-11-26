<script lang="ts">
	import CustomButton from '#lib/components/customUI/button/customButton.svelte';
	import MainButton from '#lib/components/customUI/button/MainButton.svelte';
	import EmailEditor from '#lib/components/layout/EmailEditor.svelte';
	import * as Dialog from "#lib/components/ui/dialog/index.js";
	import {
	  Search,
	  Filter,
	  Mail as MailIcon,
	  Send,
	  Download,
	  Trash2,
	  UserPlus,
	  Loader
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import Button from '#lib/components/ui/button/button.svelte';
	import { deleteSubscriber, getSubscribers, sendNewsletter } from '#lib/remote/newsletter.remote.ts';
	import { sendNewsletterSchema } from '#lib/validation/validation.ts';
  
	// state (runes)
	let subscribers = $derived(await getSubscribers());

	let confirmOpen = $state(false);
	let pendingDeleteId: string | null = $state(null);
	let query = $state('');
  
	let selected = $state<Record<string, boolean>>({});
	let message = $state('');
	let deleting = $state(false);
	let rootIssues = $derived(
		(sendNewsletter.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);

  
	// derived values
	let filtered = $derived(
	  subscribers.filter((s: any) => {
		const hay = `${s.email}`.toLowerCase();
		const matchesQuery = hay.includes(query.toLowerCase());
		return matchesQuery;
	  })
	);
  
	function toggleSelect(id: string) {
	  selected = { ...selected, [id]: !selected[id] };
	}
  
	function selectAll() {
	  const allSelected = filtered.every((s: any) => selected[s.id]);
	  if (allSelected) {
		const next = { ...selected };
		filtered.forEach((s: any) => delete next[s.id]);
		selected = next;
	  } else {
		const next = { ...selected };
		filtered.forEach((s: any) => (next[s.id] = true));
		selected = next;
	  }
	}
  

	function handleEditorChange(val: string) {
		message = val;
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
					checked={filtered.length > 0 && filtered.every((s: any) => selected[s.id])}
					onchange={selectAll}
					class="rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
				/>
				<span class="text-sm font-synonym font-medium text-brand-grey-500">{filtered.length} Subscribers</span>
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
								<span>Joined: {new Date(s.createdAt).toLocaleDateString()}</span>
								<span>•</span>
							</div>
							</div>

							<div class="flex items-center gap-2">
							<Dialog.Root open={confirmOpen} onOpenChange={(v: any) => (confirmOpen = v)}>
								<Dialog.Trigger>
									<button
										onclick={() => {
											pendingDeleteId = s.id;
											confirmOpen = true;
										}}
										class="p-2 text-brand-grey-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
										title="Delete subscriber"
									>
										<Trash2 size={16} />
									</button>
								</Dialog.Trigger>
								<Dialog.Content class="sm:max-w-md">
									<Dialog.Header>
										<Dialog.Title>Remove subscriber?</Dialog.Title>
										<Dialog.Description>
											Are you sure you want to unsubscribe or delete this email from your newsletter list? 
											This action cannot be undone.
										</Dialog.Description>
									</Dialog.Header>
									<Dialog.Footer class="flex gap-4">
										<Dialog.Close>
											<CustomButton variant="outline" className="text-black">Cancel</CustomButton>
										</Dialog.Close>
										<MainButton
											disabled={deleting}
											variant="destructive"
											type="button"
											class="px-3 py-5 bg-red-600"
											onclick={async () => {
												if (!pendingDeleteId) return;
												deleting = true;
												try {
													await deleteSubscriber({ id: pendingDeleteId });
													toast.success('Subscriber removed successfully');
													confirmOpen = false;
													pendingDeleteId = null;
												} catch (err: any) {
													toast.error('Failed to remove subscriber', {
														description: err?.message || 'Unable to delete subscriber'
													});
												} finally {
													deleting = false;
												}
											}}
										>
											{#if deleting}
												<Loader size={16} />
												<span>removing</span>
											{:else}
												Yes, remove
											{/if}
										</MainButton>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
							</div>
						</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<!-- {/* Composer */} -->
	<form
		class="bg-white rounded-xl p-6 border border-brand-grey-50"
		{...sendNewsletter.preflight(sendNewsletterSchema).enhance(async ({ form, submit }) => {
			const ok = await submit();
			if (!ok) return;
			toast.success('Newsletter sent successfully', {
				description: 'Your broadcast has been delivered to all subscribers.'
			});
			message = '';
			form.reset();
		})}
		oninput={() => sendNewsletter.validate()}
	>
		<h3 class="font-cabinet font-medium text-brand-grey-500 mb-3">Compose Newsletter</h3>
		<div class="space-y-3">
			<input
				{...sendNewsletter.fields.subject.as('text')}
				placeholder="Subject"
				class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
			/>
			{#each sendNewsletter.fields.subject.issues() as issue}
				<p class="mt-1 text-sm text-red-500">{issue.message}</p>
			{/each}

			<!-- GrapesJS Email Builder -->
			<EmailEditor value={message} onChange={handleEditorChange} />

			<input {...sendNewsletter.fields.message.as('hidden', message)} />

			{#each sendNewsletter.fields.message.issues() as issue}
				<p class="mt-1 text-sm text-red-500">{issue.message}</p>
			{/each}
			{#each rootIssues as issue}
				<p class="mt-1 text-sm text-red-500">{issue.message}</p>
			{/each}

			<div class="flex items-center gap-2">
				<MainButton
					type="submit"
					disabled={Boolean(sendNewsletter.pending)}
					class="flex items-center gap-3 bg-brand-orange-500 text-white py-6 rounded-lg text-sm font-synonym hover:bg-brand-orange-500/90 transition-colors disabled:opacity-50"
				>
					{#if sendNewsletter.pending}
						<Loader size={16} />
						<span>Sending</span>
					{:else}
						<Send size={16} />
						Send to All Subscribed
					{/if}
				</MainButton>

				<CustomButton
					type="button"
					onclick={() => {
						message = '';
						sendNewsletter.fields.set({ subject: '', message: '' });
					}}
					className="flex items-center px-4 py-2 rounded-lg text-sm font-synonym text-black transition-colors"
				>
					Clear
				</CustomButton>
			</div>
		</div>
	</form>
</div>

