<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Save, Eye, ArrowLeft, Upload, X, Calendar, Globe } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
	import RichTextEditor from '$lib/components/layout/RichTextEditor.svelte';

  
    interface ArticleData {
      title: string;
      excerpt: string;
      content: string;
      categories: string[];
      status: 'Draft' | 'Published' | 'Scheduled';
      publishDate: string;
      tags: string[];
      featuredImage?: string;
      seoTitle: string;
      seoDescription: string;
    }
  
    let isLoading = $state(false);
    let isSaving = $state(false);
    let tagInput = $state('');
  
    const params = get(page).params;
    const id = params.id;
    const isEditing = Boolean(id);
  
    let article: ArticleData = $state({
      title: '',
      excerpt: '',
      content: '',
      categories: ['Development'],
      status: 'Draft',
      publishDate: new Date().toISOString().split('T')[0],
      tags: [],
      featuredImage: '',
      seoTitle: '',
      seoDescription: ''
    });


  
    // onMount(() => {
    //   if (isEditing && id) {
    //     // Sample data for editing
    //     article = {
    //       title: 'Getting Started with React Development',
    //       excerpt: 'Learn the fundamentals of React development including components...',
    //       content: `# Getting Started with React Development\n\nReact is a powerful JavaScript library...`,
    //       category: 'Development',
    //       status: 'Published',
    //       publishDate: '2024-01-15',
    //       tags: ['React', 'JavaScript', 'Web Development', 'Frontend'],
    //       featuredImage: 'https://api.builder.io/api/v1/image/assets/TEMP/1d2f0f807704c4679e4542643fb50522e067e921?width=773',
    //       seoTitle: 'Getting Started with React Development - Complete Guide',
    //       seoDescription: 'Learn React fundamentals including components, state management...'
    //     };
    //   }
    // });
  
    function handleInputChange(field: keyof ArticleData, value: string) {
      article = { ...article, [field]: value };
    }
  
    function handleAddTag() {
        console.log(tagInput);
        
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
  
    async function handleSave(status: 'Draft' | 'Published' | 'Scheduled' = article.status) {
      isSaving = true;
      await new Promise((r) => setTimeout(r, 1000)); // simulate API
      article = { ...article, status };
      console.log('Saving article:', article);
      isSaving = false;
      goto('/dashboard/articles');
    }
  
    function handleImageUpload(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        article = { ...article, featuredImage: imageUrl };
      }
    }
</script>
  

<div class="max-w-4xl mx-auto space-y-6">
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
                {isEditing ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p class="text-brand-grey-400 font-synonym text-sm">
                {isEditing ? 'Update your article content and settings' : 'Write and publish a new article'}
            </p>
        </div>
    </div>

    <div class="flex items-center gap-3">
        <button
            onclick={() => handleSave('Draft')}
            disabled={isSaving}
            class="flex items-center gap-2 px-4 py-2 border border-brand-grey-200 text-brand-grey-500 rounded-lg hover:bg-brand-grey-50 transition-colors disabled:opacity-50"
        >
        <Save size={16} />
        Save Draft
        </button>
        <button
            onclick={() => handleSave('Published')}
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
                value={article.title}
                onchange={(e: any) => handleInputChange('title', e.target.value)}
                placeholder="Enter your article title..."
                class="w-full px-4 py-3 border border-brand-grey-50 rounded-lg font-cabinet text-lg placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                />
            </div>

            <div>
                <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                Article Excerpt
                </label>
                <textarea
                    value={article.excerpt}
                    onchange={(e: any) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Write a brief description of your article..."
                    rows={3}
                    class="w-full px-4 py-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent resize-none"
                ></textarea>
            </div>
            </div>

            <!-- {/* Featured Image */} -->
            <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
            <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-4">
                Featured Image
            </label>
            
            {#if article.featuredImage}
                <div class="relative">
                    <img
                        src={article.featuredImage}
                        alt="Featured"
                        class="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                        onclick={() => article = { ...article, featuredImage: '' }}
                        class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            {:else}
                <label class="flex flex-col items-center justify-center w-full h-48 border-2 border-brand-grey-100 border-dashed rounded-lg cursor-pointer hover:bg-brand-grey-50 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload class="w-8 h-8 mb-4 text-brand-grey-400" />
                    <p class="mb-2 text-sm text-brand-grey-500 font-synonym">
                    <span class="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-brand-grey-400 font-synonym">PNG, JPG or WEBP (MAX. 2MB)</p>
                </div>
                <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    onchange={handleImageUpload}
                />
                </label>
            {/if}
            </div>

            <!-- {/* Content Editor */} -->
            <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
                <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-4">
                    Article Content
                </label>
                <RichTextEditor value={article.content} />
            </div>
        </div>

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
                value={article.status}
                onchange={(e: any) => handleInputChange('status', e?.target?.value)}
                class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
                </select>
            </div>

            <div>
                <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                Publish Date
                </label>
                <input
                type="date"
                value={article.publishDate}
                onchange={(e: any) => handleInputChange('publishDate', e?.target?.value)}
                class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                />
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
                value={article.seoTitle}
                onchange={(e: any) => handleInputChange('seoTitle', e.target.value)}
                placeholder="SEO optimized title..."
                class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym text-sm placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                />
            </div>

            <div>
                <label for="" class="block text-sm font-synonym font-medium text-brand-grey-500 mb-2">
                Meta Description
                </label>
                <textarea
                value={article.seoDescription}
                onchange={(e: any) => handleInputChange('seoDescription', e.target.value)}
                placeholder="SEO meta description..."
                rows={3}
                class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg font-synonym text-sm placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent resize-none"
                ></textarea>
            </div>
            </div>
        </div>
    </div>
    
</div>
