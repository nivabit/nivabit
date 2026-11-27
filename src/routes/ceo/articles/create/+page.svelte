<script lang="ts">
	import { goto } from '$app/navigation';
	import { Save, ArrowLeft, Upload, Globe } from 'lucide-svelte';
	import RichTextEditor from '#lib/components/layout/RichTextEditor.svelte';
	import Button from '#lib/components/ui/button/button.svelte';
	import { IMAGE_MAX_FILE_SIZE_BYTES, IMAGE_MAX_FILE_SIZE_MB } from '#lib/constants/imageLimit.ts';
	import { DEFAULT_ARTICLE_CATEGORIES } from '#lib/constants/articleCategories.ts';
	import { toast } from 'svelte-sonner';
	import { X } from '@lucide/svelte';
	import { createArticle } from '#lib/remote/articles.remote.ts';
	import { articleFormSchema } from '#lib/validation/articleSchema.ts';

	let availableCategories = $state<string[]>([...DEFAULT_ARTICLE_CATEGORIES]);
	let categoryInput = $state('');

	let isSaving = $derived(Boolean(createArticle.pending));
	let tagInput = $state('');
	let imageInput: HTMLInputElement;
	let featuredImageURL = $state('');
	let localImageError = $state('');
	let content = $state('');
	let tags = $state<string[]>([]);

	createArticle.fields.status.set('PUBLISHED');

	let currentStatus = $derived(createArticle.fields.status.value() ?? 'PUBLISHED');
	let rootIssues = $derived(
		(createArticle.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);

	function handleAddCategory() {
		const trimmed = categoryInput.trim();
		if (!trimmed) return;
		if (!availableCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
			availableCategories = [...availableCategories, trimmed];
		}
		const current = createArticle.fields.categories.value() ?? [];
		if (!current.includes(trimmed)) {
			createArticle.fields.categories.set([...current, trimmed]);
		}
		categoryInput = '';
	}

	function handleAddTag() {
		const trimmed = tagInput.trim();
		if (trimmed && !tags.includes(trimmed)) {
			tags = [...tags, trimmed];
			tagInput = '';
		}
	}

	function handleRemoveTag(tagToRemove: string) {
		tags = tags.filter((t) => t !== tagToRemove);
	}

	function handleImageClick() {
		imageInput.click();
	}

	function handleImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		localImageError = '';
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			localImageError = 'Please upload a valid image file.';
			return;
		}
		if (file.size > IMAGE_MAX_FILE_SIZE_BYTES) {
			localImageError = `Image must be less than ${IMAGE_MAX_FILE_SIZE_MB}MB.`;
			return;
		}

		featuredImageURL = URL.createObjectURL(file);
	}
</script>

<div class="mx-auto">
	<form
		class="space-y-6"
		enctype="multipart/form-data"
		{...createArticle.preflight(articleFormSchema).enhance(async ({ submit }) => {
			const ok = await submit();
			if (!ok) return;

			if (currentStatus === 'DRAFT') {
				toast.success('Draft saved successfully', {
					description: 'You can continue editing this article anytime.'
				});
			} else {
				toast.success('Article published successfully!', {
					description: 'Your article is now live and visible on the site.'
				});
			}

			setTimeout(() => {
				goto('/ceo/articles');
			}, 1200);
		})}
	>
		{#each rootIssues as issue}
			<div class="rounded-lg bg-red-100 p-3">
				<p class="text-sm text-red-600">{issue.message}</p>
			</div>
		{/each}

		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a
					href="/ceo/articles"
					class="rounded-lg p-2 text-brand-grey-400 transition-colors hover:bg-brand-grey-50 hover:text-brand-grey-500"
				>
					<ArrowLeft size={20} />
				</a>
				<div>
					<h1 class="font-cabinet text-2xl font-medium text-brand-grey-500">Create New Article</h1>
					<p class="font-synonym text-sm text-brand-grey-400">Write and publish a new article</p>
				</div>
			</div>

			<div class="flex items-center gap-3">
				{#if currentStatus === 'DRAFT'}
					<button
						type="submit"
						disabled={isSaving}
						class="flex items-center gap-2 rounded-lg border border-brand-grey-200 px-4 py-2 text-brand-grey-500 transition-colors hover:bg-brand-grey-50 disabled:opacity-50"
					>
						{#if isSaving}
							<div class="h-4 w-4 animate-spin rounded-full border-2 border-brand-grey-400 border-t-transparent"></div>
						{:else}
							<Save size={16} />
						{/if}
						Save Draft
					</button>
				{:else}
					<button
						type="submit"
						disabled={isSaving}
						class="flex cursor-pointer items-center gap-2 rounded-lg bg-[#2563eb] px-6 py-2 text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-50"
					>
						{#if isSaving}
							<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
						{:else}
							<Globe size={16} />
						{/if}
						Publish
					</button>
				{/if}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="space-y-6 lg:col-span-2">
				<div class="space-y-4 rounded-xl border border-brand-grey-50 bg-white p-6">
					<div>
						<label for="title" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Article Title
						</label>
						<input
							id="title"
							{...createArticle.fields.title.as('text')}
							placeholder="Enter your article title..."
							class="font-cabinet w-full rounded-lg border border-brand-grey-50 px-4 py-3 text-lg placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						/>
						{#each createArticle.fields.title.issues() as issue}
							<p class="mt-1 text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>

					<div>
						<label for="excerpt" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Article Excerpt
						</label>
						<textarea
							id="excerpt"
							{...createArticle.fields.excerpt.as('text')}
							placeholder="Write a brief description of your article..."
							rows={3}
							class="font-synonym w-full resize-none rounded-lg border border-brand-grey-50 px-4 py-3 placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						></textarea>
						{#each createArticle.fields.excerpt.issues() as issue}
							<p class="mt-1 text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>
				</div>

				<!-- Featured Image -->
				<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
					<label for="featuredImage" class="font-synonym mb-4 block text-sm font-medium text-brand-grey-500">
						Featured Image
					</label>

					<Button
						type="button"
						variant="ghost"
						class="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-grey-100 transition-colors hover:bg-brand-grey-50"
						onclick={handleImageClick}
					>
						{#if featuredImageURL}
							<div class="relative">
								<img src={featuredImageURL} alt="Featured" class="h-48 w-full rounded-lg object-cover" />
							</div>
						{:else}
							<div class="flex flex-col items-center justify-center pt-5 pb-6">
								<Upload class="mb-4 h-8 w-8 text-brand-grey-400" />
								<p class="font-synonym mb-2 text-sm text-brand-grey-500">
									<span class="font-medium">Click to upload</span> or drag and drop
								</p>
								<p class="font-synonym text-xs text-brand-grey-400">PNG, JPG or WEBP (MAX. 2MB)</p>
							</div>
						{/if}
						<input
							id="featuredImage"
							{...createArticle.fields.featuredImage.as('file')}
							accept="image/*"
							bind:this={imageInput}
							onchange={handleImageUpload}
							class="hidden"
						/>
					</Button>

					{#if localImageError}
						<p class="mt-2 text-sm text-red-500">{localImageError}</p>
					{/if}
					{#each createArticle.fields.featuredImage.issues() as issue}
						<p class="mt-2 text-sm text-red-500">{issue.message}</p>
					{/each}
				</div>

				<!-- Content Editor -->
				<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
					<label for="content" class="font-synonym mb-4 block text-sm font-medium text-brand-grey-500">
						Article Content
					</label>
					<RichTextEditor bind:value={content} />
					<input {...createArticle.fields.content.as('hidden', content)} />
					{#each createArticle.fields.content.issues() as issue}
						<p class="mt-2 text-sm text-red-500">{issue.message}</p>
					{/each}
				</div>
			</div>

			{#each tags as tag, i}
				<input {...createArticle.fields.tags[i].as('hidden', tag)} />
			{/each}

			<!-- Sidebar -->
			<div class="space-y-6">
				<div class="space-y-4 rounded-xl border border-brand-grey-50 bg-white p-6">
					<h3 class="font-cabinet font-medium text-brand-grey-500">Publishing</h3>

					<div>
						<label for="status" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Status
						</label>
						<select
							id="status"
							{...createArticle.fields.status.as('select')}
							class="font-synonym w-full rounded-lg border border-brand-grey-50 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						>
							<option value="DRAFT">Draft</option>
							<option value="PUBLISHED">Published</option>
						</select>
					</div>

					<div>
						<p class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">Category</p>

						<div class="grid grid-cols-2 gap-2">
							{#each availableCategories as cat}
								<label class="font-synonym flex cursor-pointer items-center gap-2 text-sm text-brand-grey-500">
									<input
										{...createArticle.fields.categories.as('checkbox', cat)}
										class="h-4 w-4 rounded accent-[#2563eb]"
									/>
									<span class="truncate">{cat}</span>
								</label>
							{/each}
						</div>

						<div class="mt-3 flex gap-2">
							<input
								type="text"
								bind:value={categoryInput}
								onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
								placeholder="Add custom category..."
								class="font-synonym min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 focus:outline-none"
							/>
							<button
								type="button"
								onclick={handleAddCategory}
								class="shrink-0 cursor-pointer rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
							>
								Add
							</button>
						</div>

						{#each createArticle.fields.categories.issues() as issue}
							<p class="mt-1 text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>
				</div>

				<!-- Tags -->
				<div class="space-y-4 rounded-xl border border-brand-grey-50 bg-white p-6">
					<h3 class="font-cabinet font-medium text-brand-grey-500">Tags</h3>

					<div class="flex gap-2">
						<input
							type="text"
							bind:value={tagInput}
							onkeypress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
							placeholder="Add a tag..."
							class="font-synonym flex-1 rounded-lg border border-brand-grey-50 px-3 py-2 text-sm placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						/>
						<button
							type="button"
							onclick={handleAddTag}
							class="cursor-pointer rounded-lg bg-[#2563eb] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
						>
							Add
						</button>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each tags as tag}
							<span
								class="font-synonym inline-flex items-center gap-1 rounded-full bg-brand-blue-50 px-3 py-1 text-sm text-brand-blue-500"
							>
								{tag}
								<button
									type="button"
									onclick={() => handleRemoveTag(tag)}
									class="transition-colors hover:text-brand-blue-700"
								>
									<X size={14} />
								</button>
							</span>
						{/each}
					</div>

					{#each createArticle.fields.tags.issues() as issue}
						<p class="mt-1 text-sm text-red-500">{issue.message}</p>
					{/each}
				</div>

				<!-- SEO Settings -->
				<div class="space-y-4 rounded-xl border border-brand-grey-50 bg-white p-6">
					<h3 class="font-cabinet font-medium text-brand-grey-500">SEO Settings</h3>

					<div>
						<label for="seoTitle" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							SEO Title
						</label>
						<input
							id="seoTitle"
							{...createArticle.fields.seoTitle.as('text')}
							placeholder="SEO optimized title..."
							class="font-synonym w-full rounded-lg border border-brand-grey-50 px-3 py-2 text-sm placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						/>
						{#each createArticle.fields.seoTitle.issues() as issue}
							<p class="mt-1 text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>

					<div>
						<label
							for="seoDescription"
							class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500"
						>
							Meta Description
						</label>
						<textarea
							id="seoDescription"
							{...createArticle.fields.seoDescription.as('text')}
							placeholder="SEO meta description..."
							rows={3}
							class="font-synonym w-full resize-none rounded-lg border border-brand-grey-50 px-3 py-2 text-sm placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						></textarea>
						{#each createArticle.fields.seoDescription.issues() as issue}
							<p class="mt-1 text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
