<script lang="ts">
    import { goto } from '$app/navigation';
    import { Save, Eye, ArrowLeft, Upload, X, Calendar, Globe } from 'lucide-svelte';
	import RichTextEditor from '$lib/components/layout/RichTextEditor.svelte';
    import { enhance } from "$app/forms";
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { IMAGE_MAX_FILE_SIZE_BYTES, IMAGE_MAX_FILE_SIZE_MB } from '$lib/constants/imageLimit';
	import type { ArticleData } from '$lib/types/article.type';
    import { toast } from "svelte-sonner";


    let isSaving = $state(false);
    let tagInput = $state('');
    let formError: Record<string, any> | undefined = $state({});
    let imageInput: HTMLInputElement;
  
    let article: ArticleData = $state({
      title: '',
      excerpt: '',
      content: '',
      categories: [],
      status: 'PUBLISHED',
      tags: [],
      featuredImage: null,
      seoTitle: '',
      seoDescription: '',
      featuredImageURL: ""
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
        formError = {}

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            formError = {featuredImage: ["Please upload a valid image file."]}
            return;
        }

        if (file.size > IMAGE_MAX_FILE_SIZE_BYTES) {
            formError = {images: [`Each image must be less than ${IMAGE_MAX_FILE_SIZE_MB}MB.`]}
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        article = { ...article, featuredImageURL: imageUrl};
        formError = {}
    }
</script>
  

<div class="mx-auto">
    <form action="?/create" method="post" class="space-y-6" enctype="multipart/form-data"
        use:enhance={() => {
            isSaving = true;
            formError = {};
            return async ({ result }) => {
            isSaving = false;
            console.log(result);
            
            if (result.type === "failure" && result.data) {
                formError = result.data.errors as any;
            } else if (result.type === "error") {
                formError = { root: result.error.message || "Unexpected error" };
            } else if (result.type === "success") {
                // Clear form fields
                article = {
                    title: '',
                    excerpt: '',
                    content: '',
                    categories: [],
                    status: 'PUBLISHED',
                    tags: [],
                    featuredImage: null,
                    seoTitle: '',
                    seoDescription: '',
                    featuredImageURL: ""
                };

                toast.success("Message was sent successfully", {
                    description: "Thanks for contacting us, our team will reach out soon."
                });
            }
            };
        }}
    >
    {#if formError?.root}
        <div class="p-3 bg-red-100">
            <p class="text-sm text-red-500 mt-2">{formError.root}</p>
        </div>
    {/if}
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <a
                href="/dashboard/articles"
                class="p-2 text-brand-grey-400 hover:text-brand-grey-500 hover:bg-brand-grey-50 rounded-lg transition-colors"
                >
                <ArrowLeft size={20} />
                </a>
                <div>
                    <h1 class="text-2xl font-cabinet font-medium text-brand-grey-500">
                        Create New Article
                    </h1>
                    <p class="text-brand-grey-400 font-synonym text-sm">
                        Write and publish a new article
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                {#if article.status === 'DRAFT'}
                    <button
                        type="submit"
                        disabled={isSaving}
                        class="flex items-center gap-2 px-4 py-2 border border-brand-grey-200 text-brand-grey-500 rounded-lg hover:bg-brand-grey-50 transition-colors disabled:opacity-50"
                    >
                        {#if isSaving}
                            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        {:else}
                            <Save size={16} />
                        {/if}
                        Save Draft
                    </button>
                    {:else}
                    <button
                        type="submit"
                        disabled={isSaving}
                        class="flex items-center gap-2 bg-brand-orange-500 text-white px-6 py-2 rounded-lg hover:bg-brand-orange-500/90 transition-colors disabled:opacity-50"
                    >
                        {#if isSaving}
                            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        {:else}
                            <Globe size={16} />
                        {/if}
                        Publish
                    </button>
                {/if}
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- {/* Main Content */} -->
            <div class="lg:col-span-2 space-y-6">
                <!-- {/* Title and Excerpt */} -->
                <div class="bg-white rounded-xl p-6 border border-brand-grey-50 space-y-4">
                    <div>
                        <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                        Article Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={article.title}
                            onchange={(e: any) => handleInputChange('title', e.target.value)}
                            placeholder="Enter your article title..."
                            class="w-full px-4 py-3 border border-brand-grey-50 rounded-lg font-cabinet text-lg placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                        />
                        {#if formError?.title}
                            <p class="text-sm text-red-500 mt-1">{formError.title}</p>
                        {/if}
                    </div>

                    <div>
                        <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                        Article Excerpt
                        </label>
                        <textarea
                            name="excerpt"
                            value={article.excerpt}
                            onchange={(e: any) => handleInputChange('excerpt', e.target.value)}
                            placeholder="Write a brief description of your article..."
                            rows={3}
                            class="w-full px-4 py-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent resize-none"
                        ></textarea>
                        {#if formError?.excerpt}
                            <p class="text-sm text-red-500 mt-1">{formError.excerpt}</p>
                        {/if}
                    </div>
                </div>

                <!-- {/* Featured Image */} -->
                <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
                    <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-4">
                        Featured Image
                    </label>

                    <Button
                        variant="ghost"
                        class="flex flex-col items-center justify-center w-full h-48 border-2 border-brand-grey-100 border-dashed rounded-lg cursor-pointer hover:bg-brand-grey-50 transition-colors"
                        onclick={handleImageClick}
                        >
                        {#if article.featuredImageURL}
                            <div class="relative">
                                <img
                                    src={article.featuredImageURL}
                                    alt="Featured"
                                    class="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        {:else}
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload class="w-8 h-8 mb-4 text-brand-grey-400" />
                                <p class="mb-2 text-sm text-brand-grey-500 font-synonym">
                                <span class="font-medium">Click to upload</span> or drag and drop
                                </p>
                                <p class="text-xs text-brand-grey-400 font-synonym">PNG, JPG or WEBP (MAX. 2MB)</p>
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
                        <p class="text-sm text-red-500 mt-2">{formError.featuredImage}</p>
                    {/if}

                </div>

                <!-- {/* Content Editor */} -->
                <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
                    <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-4">
                        Article Content
                    </label>
                    <RichTextEditor bind:value={article.content} />
                    <Textarea name="content" class="hidden" id="content" bind:value={article.content} ></Textarea>
                    {#if formError?.content}
                        <p class="text-sm text-red-500 mt-2">{formError.content}</p>
                    {/if}
                </div>
            </div>

            {#each article.tags as tag}
                <input type="hidden" name="tags" value={tag} />
            {/each}

            {#each article.categories as cat}
                <input type="hidden" name="categories" value={cat} />
            {/each}

            <!-- {/* Sidebar */} -->
            <div class="space-y-6">
                <!-- {/* Publishing Options */} -->
                <div class="bg-white rounded-xl p-6 border border-brand-grey-50 space-y-4">
                    <h3 class="font-cabinet font-medium text-brand-grey-500">Publishing</h3>
                    
                    <div>
                        <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={article.status}
                            onchange={(e: any) => handleInputChange('status', e?.target?.value)}
                            class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                            >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                    </div>

                    <div>
                        <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                            Category
                        </label>

                        <div class="grid grid-cols-2 gap-2">
                            {#each ['Development', 'Design', 'Research', 'Technology', 'Business'] as cat}
                                <label class="flex items-center gap-2 text-sm text-brand-grey-500 font-synonym">
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
                            <p class="text-sm text-red-500 mt-1">{formError.categories}</p>
                        {/if}
                    </div>
                </div>

                <!-- {/* Tags */} -->
                <div class="bg-white rounded-xl p-6 border border-brand-grey-50 space-y-4">
                    <h3 class="font-cabinet font-medium text-brand-grey-500">Tags</h3>
                    
                    <div class="flex gap-2">
                        <input
                            type="text"
                            bind:value={tagInput}
                            onkeypress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="Add a tag..."
                            class="flex-1 px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym text-sm placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                        />
                        <button
                            onclick={handleAddTag}
                            class="px-3 py-2 bg-brand-orange-500 text-white rounded-lg hover:bg-brand-orange-500/90 transition-colors"
                        >
                        Add
                        </button>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        {#each article.tags as tag}
                        <span 
                            class="inline-flex items-center gap-1 px-3 py-1 bg-brand-blue-50 text-brand-blue-500 rounded-full text-sm font-synonym"
                        >
                            {tag}
                            <button
                            onclick={() => handleRemoveTag(tag)}
                            class="hover:text-brand-blue-700 transition-colors"
                            >
                            <X size={14} />
                            </button>
                        </span>
                        {/each }
                    </div>

                    {#if formError?.tags}
                        <p class="text-sm text-red-500 mt-1">{formError.tags}</p>
                    {/if}
                </div>

                <!-- {/* SEO Settings */} -->
                <div class="bg-white rounded-xl p-6 border border-brand-grey-50 space-y-4">
                    <h3 class="font-cabinet font-medium text-brand-grey-500">SEO Settings</h3>
                    
                    <div>
                        <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                        SEO Title
                        </label>
                        <input
                            type="text"
                            name="seoTitle"
                            value={article.seoTitle}
                            onchange={(e: any) => handleInputChange('seoTitle', e.target.value)}
                            placeholder="SEO optimized title..."
                            class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym text-sm placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                        />
                        {#if formError?.seoTitle}
                            <p class="text-sm text-red-500 mt-1">{formError.seoTitle}</p>
                        {/if}
                    </div>

                    <div>
                        <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                        Meta Description
                        </label>
                        <textarea
                            value={article.seoDescription}
                            name="seoDescription"
                            onchange={(e: any) => handleInputChange('seoDescription', e.target.value)}
                            placeholder="SEO meta description..."
                            rows={3}
                            class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym text-sm placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent resize-none"
                        ></textarea>
                        {#if formError?.seoDescription}
                            <p class="text-sm text-red-500 mt-1">{formError.seoDescription}</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
