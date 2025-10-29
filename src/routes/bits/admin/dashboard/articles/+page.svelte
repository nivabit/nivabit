<script lang="ts">
	import type { GetarticleData } from '$lib/types/article.type';
	import {
		Plus,
		Search,
		Filter,
		Eye,
		Edit,
		Trash2,
		Calendar,
		User,
		FileText,
		Loader
	} from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let articles: GetarticleData[] = $derived(data?.articles) as any;
	
	let loading = $state(false);
	let searchTerm = $state('');
	let statusFilter = $state('All');
	let selectedArticles: string[] = $state([]);
	let articleToDelete: string | null = $state(null);
	let deleteArticleState = $state(false);

	const filteredArticles = $derived(
		articles.filter((article) => {
			const matchesSearch =
				article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

			const statusNormalized = article.status.toLowerCase();
			const matchesStatus =
				statusFilter === 'All' || statusNormalized === statusFilter.toLowerCase();

			return matchesSearch && matchesStatus;
		})
	);

	function handleSelectArticle(id: string) {
		if (selectedArticles.includes(id)) {
			selectedArticles = selectedArticles.filter((articleId) => articleId !== id);
		} else {
			selectedArticles = [...selectedArticles, id];
		}
	}

	function handleSelectAll() {
		if (selectedArticles.length === filteredArticles.length) {
			selectedArticles = [];
		} else {
			selectedArticles = filteredArticles.map((article) => article?.id);
		}
	}

	function handleBulkDelete() {
		if (confirm(`Are you sure you want to delete ${selectedArticles.length} selected articles?`)) {
			articles = articles.filter((article) => !selectedArticles.includes(article.id));
			selectedArticles = [];
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'Published':
				return 'bg-green-100 text-green-700';
			case 'Draft':
				return 'bg-yellow-100 text-yellow-700';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
		<div>
			<h1 class="font-cabinet text-2xl font-medium text-brand-grey-500">Articles Management</h1>
			<p class="font-synonym text-brand-grey-400">Manage all your blog articles and content</p>
		</div>
		<a
			href="/bits/admin/dashboard/articles/create"
			class="font-synonym flex items-center gap-2 rounded-lg bg-brand-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-orange-500/90"
		>
			<Plus size={18} />
			Create Article
		</a>
	</div>

	<!-- Filters and Search -->
	<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
		<div class="flex flex-col gap-4 lg:flex-row">
			<!-- Search -->
			<div class="relative flex-1">
				<Search
					class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-brand-grey-400"
				/>
				<input
					type="text"
					placeholder="Search articles..."
					bind:value={searchTerm}
					class="font-synonym w-full rounded-lg border border-brand-grey-50 py-2 pr-4 pl-10 placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
				/>
			</div>

			<!-- Status Filter -->
			<div class="flex items-center gap-2">
				<Filter class="h-4 w-4 text-brand-grey-400" />
				<select
					bind:value={statusFilter}
					class="font-synonym rounded-lg border border-brand-grey-50 px-3 py-2 text-brand-grey-500 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
				>
					<option value="All">All Status</option>
					<option value="Published">Published</option>
					<option value="Draft">Draft</option>
				</select>
			</div>

			<!-- Bulk Actions -->
			{#if selectedArticles.length > 0}
				<button
					onclick={handleBulkDelete}
					class="font-synonym flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
				>
					<Trash2 size={16} />
					Delete Selected ({selectedArticles.length})
				</button>
			{/if}
		</div>
	</div>

	<!-- Articles List -->
	<div class="overflow-hidden rounded-xl border border-brand-grey-50 bg-white">
		<!-- Table Header -->
		<div class="border-b border-brand-grey-50 bg-bg-blue px-6 py-4">
			<div class="flex items-center gap-4">
				<input
					type="checkbox"
					checked={selectedArticles.length === filteredArticles.length &&
						filteredArticles.length > 0}
					onchange={handleSelectAll}
					class="rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
				/>
				<span class="font-synonym text-sm font-medium text-brand-grey-500">
					{articles.length} Articles
				</span>
			</div>
		</div>

		<!-- Articles Grid -->
		<div class="divide-y divide-brand-grey-50">
			{#if articles.length === 0}
				<div class="p-12 text-center">
					<FileText class="mx-auto mb-4 h-12 w-12 text-brand-grey-200" />
					<h3 class="font-cabinet mb-2 text-lg font-medium text-brand-grey-500">
						No articles found
					</h3>
					<p class="font-synonym mb-6 text-brand-grey-400">
						{searchTerm || statusFilter !== 'All'
							? 'Try adjusting your search or filter criteria'
							: 'Get started by creating your first article'}
					</p>
					{#if !searchTerm && statusFilter === 'All'}
						<a
							href="/bits/admin/dashboard/articles/create"
							class="font-synonym inline-flex items-center gap-2 rounded-lg bg-brand-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-orange-500/90"
						>
							<Plus size={18} />
							Create First Article
						</a>
					{/if}
				</div>
			{:else}
				{#each articles as article}
					<div class="p-6 transition-colors hover:bg-bg-blue">
						<div class="flex items-start gap-4">
							<!-- Checkbox -->
							<input
								type="checkbox"
								checked={selectedArticles.includes(article.id)}
								onchange={() => handleSelectArticle(article.id)}
								class="mt-1 rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
							/>

							<!-- Article Image -->
							<div class="shrink-0">
								<img
									src={article.featuredImage || "/images/placeholder.jpeg"}
									alt={article.title}
									class="h-20 w-20 rounded-lg object-cover"
								/>
							</div>

							<!-- Article Info -->
							<div class="min-w-0 flex-1">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1">
										<h3 class="font-cabinet mb-2 line-clamp-1 font-medium text-brand-grey-500">
											{article.title}
										</h3>
										<p class="font-synonym mb-3 line-clamp-2 text-sm text-brand-grey-400">
											{article.excerpt}
										</p>
										<div class="font-synonym flex items-center gap-4 text-xs text-brand-grey-400">
											<span class="flex items-center gap-1">
												<User size={12} />
												{article.author?.name}
											</span>
											<span class="flex items-center gap-1">
												<Calendar size={12} />
												{article.publishDate ? new Date(article.publishDate).toLocaleDateString(): "null"}
											</span>
											<span class="flex items-center gap-1">
												<Eye size={12} />
												{article.views} views
											</span>
											<span class="rounded-full bg-brand-grey-50 px-2 py-1 text-brand-grey-500">
												{article.categories}
											</span>
										</div>
									</div>

									<div class="flex items-center gap-3">
										<!-- Status -->
										<span
											class={`font-synonym rounded-full px-3 py-1 text-xs ${getStatusColor(article.status)}`}
										>
											{article.status}
										</span>

										<!-- Actions -->
										<div class="flex items-center gap-1">
											<a
												href={`/bits/admin/dashboard/articles/${article.id}/edit`}
												class="rounded-lg p-2 text-brand-grey-400 transition-colors hover:bg-brand-blue-50 hover:text-brand-blue-500"
												title="Edit article"
											>
												<Edit size={16} />
											</a>

											<!-- Delete Article Modal -->
											<Dialog.Root bind:open={deleteArticleState}>
												<Dialog.Trigger>
													<button
														onclick={() => (articleToDelete = article.id)}
														class="rounded-lg p-2 text-brand-grey-400 transition-colors hover:bg-red-50 hover:text-red-500"
														title="Delete article"
													>
														<Trash2 size={16} />
													</button>
												</Dialog.Trigger>

												<Dialog.Content class="sm:max-w-md">
													<Dialog.Header>
														<Dialog.Title>Delete Article</Dialog.Title>
														<Dialog.Description>
															Are you sure you want to delete this article? This action cannot be
															undone.
														</Dialog.Description>
													</Dialog.Header>

													<Dialog.Footer class="flex justify-end gap-2">
														<Dialog.Close>
															<Button type="button" variant="outline">Cancel</Button>
														</Dialog.Close>

														<!-- Form to submit deletion -->
														<form
															method="POST"
															action="?/delete"
															class="inline"
															use:enhance={() => {
																loading = true;
																return async ({ result }) => {
																	loading = false;
																	if (result.type === 'failure' && result.data) {
																		toast.info('Deleted Fail', {
																			description:
																				(result.data?.error as string) ||
																				'Unable to delete the article.'
																		});
																	} else if (result.type === 'error') {
																		toast.info('Deleted Fail', {
																			description:
																				(result?.error as string) || 'Unable to delete the article.'
																		});
																	} else if (result.type === 'success') {
																		toast.success('Article deleted', {
																			description: 'The article has been removed successfully.'
																		});
																		invalidateAll();
																		deleteArticleState = false
																	}
																};
															}}
														>
															<input type="hidden" name="id" value={articleToDelete} />
															<Button
																type="submit"
																class="bg-red-500 text-white hover:bg-red-600"
																disabled={loading}
															>
																{#if loading}
																	<Loader />
																{:else}
																	Yes, Delete
																{/if}
															</Button>
														</form>
													</Dialog.Footer>
												</Dialog.Content>
											</Dialog.Root>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Pagination -->
	{#if articles.length > 0}
		<div
			class="flex items-center justify-between rounded-xl border border-brand-grey-50 bg-white p-4"
		>
			<p class="font-synonym text-sm text-brand-grey-400">
				Showing {filteredArticles.length} of {articles.length} articles
			</p>
			<div class="flex items-center gap-2">
				<button
					class="font-synonym px-3 py-2 text-sm text-brand-grey-400 hover:text-brand-grey-500 disabled:opacity-50"
					disabled
				>
					Previous
				</button>
				<span class="font-synonym rounded-lg bg-brand-orange-500 px-3 py-2 text-sm text-white">
					1
				</span>
				<button
					class="font-synonym px-3 py-2 text-sm text-brand-grey-400 hover:text-brand-grey-500 disabled:opacity-50"
					disabled
				>
					Next
				</button>
			</div>
		</div>
	{/if}
</div>
