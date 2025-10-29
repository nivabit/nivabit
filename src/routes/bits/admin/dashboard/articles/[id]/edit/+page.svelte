<script lang="ts">
	import { Save, Eye, ArrowLeft, Upload, X, Calendar, Globe } from 'lucide-svelte';
	import RichTextEditor from '$lib/components/layout/RichTextEditor.svelte';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { IMAGE_MAX_FILE_SIZE_BYTES, IMAGE_MAX_FILE_SIZE_MB } from '$lib/constants/imageLimit';
	import type { ArticleData, GetarticleData } from '$lib/types/article.type';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let articles: GetarticleData = $derived(data?.article) as any;

	let isSaving = $state(false);
	let tagInput = $state('');
	let formError: Record<string, any> | undefined = $state({});
	let imageInput: HTMLInputElement;

	// Initialize with existing article data
	let article: ArticleData = $derived({
		title: articles?.title ?? '',
		excerpt: articles?.excerpt ?? '',
		content: articles?.content ?? '',
		categories: articles?.categories ?? [],
		status: articles?.status ?? 'PUBLISHED',
		tags: articles?.tags ?? [],
		featuredImage: null,
		seoTitle: articles?.seoTitle ?? '',
		seoDescription: articles?.seoDescription ?? '',
		featuredImageURL: articles?.featuredImage ?? ''
	});

	function handleInputChange(field: keyof ArticleData, value: string) {
		article = { ...article, [field]: value };
	}

	function handleAddTag() {
		if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
			article = { ...article, tags: [...article.tags, tagInput.trim()] };
			tagInput = '';
		}
	}

	function toggleCategory(cat: string) {
		if (article.categories.includes(cat)) {
			article = {
				...article,
				categories: article.categories.filter((c) => c !== cat)
			};
		} else {
			article = {
				...article,
				categories: [...article.categories, cat]
			};
		}
	}

	function handleRemoveTag(tagToRemove: string) {
		article = { ...article, tags: article.tags.filter((t) => t !== tagToRemove) };
	}

	function handleImageClick() {
		imageInput.click();
	}

	function handleImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		formError = {};

		if (!file) return;

		if (!file.type.startsWith('image/')) {
			formError = { featuredImage: ['Please upload a valid image file.'] };
			return;
		}

		if (file.size > IMAGE_MAX_FILE_SIZE_BYTES) {
			formError = { images: [`Each image must be less than ${IMAGE_MAX_FILE_SIZE_MB}MB.`] };
			return;
		}

		const imageUrl = URL.createObjectURL(file);
		article = { ...article, featuredImageURL: imageUrl };
		formError = {};
	}
</script>

<div class="mx-auto">
	<form
		action="?/edit"
		method="post"
		class="space-y-6"
		enctype="multipart/form-data"
		use:enhance={() => {
			isSaving = true;
			formError = {};
			return async ({ result }) => {
				isSaving = false;

				if (result.type === 'failure' && result.data) {
					formError = result.data.errors as any;
				} else if (result.type === 'error') {
					formError = { root: result.error.message || 'Unexpected error' };
				} else if (result.type === 'success') {
					toast.success('Article updated successfully', {
						description: 'Your changes have been saved.'
					});

					setTimeout(() => {
						goto('/bits/admin/dashboard/articles');
					}, 2000);
				}
			};
		}}
	>
		{#if formError?.root}
			<div class="bg-red-100 p-3">
				<p class="mt-2 text-sm text-red-500">{formError.root}</p>
			</div>
		{/if}
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<a
					href="/dashboard/articles"
					class="rounded-lg p-2 text-brand-grey-400 transition-colors hover:bg-brand-grey-50 hover:text-brand-grey-500"
				>
					<ArrowLeft size={20} />
				</a>
				<div>
					<h1 class="font-cabinet text-2xl font-medium text-brand-grey-500">Edit Article</h1>
					<p class="font-synonym text-sm text-brand-grey-400">
						Update your article content and settings
					</p>
				</div>
			</div>

			<div class="flex items-center gap-3">
				{#if article.status === 'DRAFT'}
					<button
						type="submit"
						disabled={isSaving}
						class="flex items-center gap-2 rounded-lg border border-brand-grey-200 px-4 py-2 text-brand-grey-500 transition-colors hover:bg-brand-grey-50 disabled:opacity-50"
					>
						{#if isSaving}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
						{:else}
							<Save size={16} />
						{/if}
						Save Draft
					</button>
				{:else}
					<button
						type="submit"
						disabled={isSaving}
						class="flex items-center gap-2 rounded-lg bg-brand-orange-500 px-6 py-2 text-white transition-colors hover:bg-brand-orange-500/90 disabled:opacity-50"
					>
						{#if isSaving}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
						{:else}
							<Globe size={16} />
						{/if}
						Publish
					</button>
				{/if}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- {/* Main Content */} -->
			<div class="space-y-6 lg:col-span-2">
				<!-- {/* Title and Excerpt */} -->
				<div class="space-y-4 rounded-xl border border-brand-grey-50 bg-white p-6">
					<div>
						<label for="" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Article Title
						</label>
						<input
							type="text"
							name="title"
							value={article.title}
							onchange={(e: any) => handleInputChange('title', e.target.value)}
							placeholder="Enter your article title..."
							class="font-cabinet w-full rounded-lg border border-brand-grey-50 px-4 py-3 text-lg placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						/>
						{#if formError?.title}
							<p class="mt-1 text-sm text-red-500">{formError.title}</p>
						{/if}
					</div>

					<div>
						<label for="" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Article Excerpt
						</label>
						<textarea
							name="excerpt"
							value={article.excerpt}
							onchange={(e: any) => handleInputChange('excerpt', e.target.value)}
							placeholder="Write a brief description of your article..."
							rows={3}
							class="font-synonym w-full resize-none rounded-lg border border-brand-grey-50 px-4 py-3 placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						></textarea>
						{#if formError?.excerpt}
							<p class="mt-1 text-sm text-red-500">{formError.excerpt}</p>
						{/if}
					</div>
				</div>

				<!-- {/* Featured Image */} -->
				<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
					<label for="" class="font-synonym mb-4 block text-sm font-medium text-brand-grey-500">
						Featured Image
					</label>

					<Button
						variant="ghost"
						class="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-grey-100 transition-colors hover:bg-brand-grey-50"
						onclick={handleImageClick}
					>
						{#if article.featuredImageURL}
							<div class="relative">
								<img
									src={article.featuredImageURL}
									alt="Featured"
									class="h-48 w-full rounded-lg object-cover"
								/>
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
							type="file"
							accept="image/*"
							bind:this={imageInput}
							onchange={handleImageUpload}
							class="hidden"
							name="featuredImage"
							id="featuredImage"
						/>
					</Button>

					{#if formError?.featuredImage}
						<p class="mt-2 text-sm text-red-500">{formError.featuredImage}</p>
					{/if}
				</div>

				<!-- {/* Content Editor */} -->
				<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
					<label for="" class="font-synonym mb-4 block text-sm font-medium text-brand-grey-500">
						Article Content
					</label>
					<RichTextEditor bind:value={article.content} />
					<Textarea name="content" class="hidden" id="content" bind:value={article.content}
					></Textarea>
					{#if formError?.content}
						<p class="mt-2 text-sm text-red-500">{formError.content}</p>
					{/if}
				</div>
			</div>

			{#each article.tags as tag}
				<input type="hidden" name="tags" value={tag} />
			{/each}

			{#each article.categories as cat}
				<input type="hidden" name="categories" value={cat} />
			{/each}
			<input type="hidden" name="id" value={articles.id} />

			<!-- {/* Sidebar */} -->
			<div class="space-y-6">
				<!-- {/* Publishing Options */} -->
				<div class="space-y-4 rounded-xl border border-brand-grey-50 bg-white p-6">
					<h3 class="font-cabinet font-medium text-brand-grey-500">Publishing</h3>

					<div>
						<label for="" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Status
						</label>
						<select
							name="status"
							value={article.status}
							onchange={(e: any) => handleInputChange('status', e?.target?.value)}
							class="font-synonym w-full rounded-lg border border-brand-grey-50 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						>
							<option value="DRAFT">Draft</option>
							<option value="PUBLISHED">Published</option>
						</select>
					</div>

					<div>
						<label for="" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Category
						</label>

						<div class="grid grid-cols-2 gap-2">
							{#each ['Development', 'Design', 'Research', 'Technology', 'Business'] as cat}
								<label class="font-synonym flex items-center gap-2 text-sm text-brand-grey-500">
									<input
										type="checkbox"
										checked={article.categories.includes(cat)}
										onchange={() => toggleCategory(cat)}
										class="accent-brand-orange-500"
									/>
									{cat}
								</label>
							{/each}
						</div>

						{#if formError?.categories}
							<p class="mt-1 text-sm text-red-500">{formError.categories}</p>
						{/if}
					</div>
				</div>

				<!-- {/* Tags */} -->
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
							class="rounded-lg bg-brand-orange-500 px-3 py-2 text-white transition-colors hover:bg-brand-orange-500/90"
						>
							Add
						</button>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each article.tags as tag}
							<span
								class="font-synonym inline-flex items-center gap-1 rounded-full bg-brand-blue-50 px-3 py-1 text-sm text-brand-blue-500"
							>
								{tag}
								<button
									onclick={() => handleRemoveTag(tag)}
									class="transition-colors hover:text-brand-blue-700"
								>
									<X size={14} />
								</button>
							</span>
						{/each}
					</div>

					{#if formError?.tags}
						<p class="mt-1 text-sm text-red-500">{formError.tags}</p>
					{/if}
				</div>

				<!-- {/* SEO Settings */} -->
				<div class="space-y-4 rounded-xl border border-brand-grey-50 bg-white p-6">
					<h3 class="font-cabinet font-medium text-brand-grey-500">SEO Settings</h3>

					<div>
						<label for="" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							SEO Title
						</label>
						<input
							type="text"
							name="seoTitle"
							value={article.seoTitle}
							onchange={(e: any) => handleInputChange('seoTitle', e.target.value)}
							placeholder="SEO optimized title..."
							class="font-synonym w-full rounded-lg border border-brand-grey-50 px-3 py-2 text-sm placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						/>
						{#if formError?.seoTitle}
							<p class="mt-1 text-sm text-red-500">{formError.seoTitle}</p>
						{/if}
					</div>

					<div>
						<label for="" class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500">
							Meta Description
						</label>
						<textarea
							value={article.seoDescription}
							name="seoDescription"
							onchange={(e: any) => handleInputChange('seoDescription', e.target.value)}
							placeholder="SEO meta description..."
							rows={3}
							class="font-synonym w-full resize-none rounded-lg border border-brand-grey-50 px-3 py-2 text-sm placeholder:text-brand-grey-400 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						></textarea>
						{#if formError?.seoDescription}
							<p class="mt-1 text-sm text-red-500">{formError.seoDescription}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
