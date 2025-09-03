<script lang="ts">
	import type {ArticleData, GetarticleData } from '$lib/types/article.type';
  import { 
    Plus, 
    Search, 
    Filter, 
    Eye, 
    Edit, 
    Trash2,
    MoreHorizontal,
    Calendar,
    User,
    FileText,

	Loader

  } from 'lucide-svelte';
  import * as Dialog from "$lib/components/ui/dialog/index.js";
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
  import { toast } from "svelte-sonner";
	import { invalidateAll } from '$app/navigation';

  
  let { data } = $props();
  let articles: GetarticleData[] = $derived(data?.articles) as any
  let loading = $state(false)
  
  let searchTerm = $state('');
  let statusFilter = $state('All');
  let selectedArticles: string[] = $state([]);
  let articleToDelete: string | null = $state(null);

  // ✅ derived (instead of $:)
  const filteredArticles = $derived(
    articles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

      const statusNormalized = article.status.toLowerCase();
      const matchesStatus = 
        statusFilter === 'All' || 
        statusNormalized === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
  );
  
  function handleSelectArticle(id: string) {
    if (selectedArticles.includes(id)) {
      selectedArticles = selectedArticles.filter(articleId => articleId !== id);
    } else {
      selectedArticles = [...selectedArticles, id];
    }
  }

  function handleSelectAll() {
    if (selectedArticles.length === filteredArticles.length) {
      selectedArticles = [];
    } else {
      selectedArticles = filteredArticles.map(article => article?.id);
    }
  }
  
  function handleBulkDelete() {
    if (confirm(`Are you sure you want to delete ${selectedArticles.length} selected articles?`)) {
      articles = articles.filter(article => !selectedArticles.includes(article.id));
      selectedArticles = [];
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-700';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
</script>
 
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
    <div>
        <h1 class="text-2xl font-cabinet font-medium text-brand-grey-500">
        Articles Management
        </h1>
        <p class="text-brand-grey-400 font-synonym">
        Manage all your blog articles and content
        </p>
    </div>
    <a
        href="/bits/admin/dashboard/articles/create"
        class="flex items-center gap-2 bg-brand-orange-500 text-white px-6 py-3 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 transition-colors"
    >
        <Plus size={18} />
        Create Article
    </a>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
      <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-grey-400 h-4 w-4" />
            <input
                type="text"
                placeholder="Search articles..."
                bind:value={searchTerm}
                class="w-full pl-10 pr-4 py-2 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
            />
          </div>

          <!-- Status Filter -->
          <div class="flex items-center gap-2">
            <Filter class="text-brand-grey-400 h-4 w-4" />
            <select
              bind:value={statusFilter}
              class="border border-brand-grey-50 rounded-lg px-3 py-2 font-synonym text-brand-grey-500 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
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
              class="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-synonym text-sm hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
              Delete Selected ({selectedArticles.length})
            </button>
          {/if}
      </div>
    </div>

    <!-- Articles List -->
    <div class="bg-white rounded-xl border border-brand-grey-50 overflow-hidden">
      <!-- Table Header -->
      <div class="bg-bg-blue px-6 py-4 border-b border-brand-grey-50">
          <div class="flex items-center gap-4">
          <input
              type="checkbox"
              checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
              onchange={handleSelectAll}
              class="rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
          />
          <span class="text-sm font-synonym font-medium text-brand-grey-500">
              {articles.length} Articles
          </span>
          </div>
      </div>

      <!-- Articles Grid -->
      <div class="divide-y divide-brand-grey-50">
        {#if articles.length === 0}
          <div class="p-12 text-center">
              <FileText class="mx-auto h-12 w-12 text-brand-grey-200 mb-4" />
              <h3 class="text-lg font-cabinet font-medium text-brand-grey-500 mb-2">
              No articles found
              </h3>
              <p class="text-brand-grey-400 font-synonym mb-6">
              {searchTerm || statusFilter !== 'All' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first article'}
              </p>
              {#if !searchTerm && statusFilter === 'All'}
              <a
                  href="/bits/admin/dashboard/articles/create"
                  class="inline-flex items-center gap-2 bg-brand-orange-500 text-white px-6 py-3 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 transition-colors"
              >
                  <Plus size={18} />
                  Create First Article
              </a>
              {/if}
          </div>
        {:else}
          {#each articles as article}
            <div class="p-6 hover:bg-bg-blue transition-colors">
              <div class="flex items-start gap-4">
                  <!-- Checkbox -->
                  <input
                  type="checkbox"
                  checked={selectedArticles.includes(article.id)}
                  onchange={() => handleSelectArticle(article.id)}
                  class="mt-1 rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
                  />

                  <!-- Article Image -->
                  <div class="flex-shrink-0">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      class="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  <!-- Article Info -->
                  <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                      <div class="flex-1">
                      <h3 class="font-cabinet font-medium text-brand-grey-500 mb-2 line-clamp-1">
                          {article.title}
                      </h3>
                      <p class="text-brand-grey-400 font-synonym text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                      </p>
                      <div class="flex items-center gap-4 text-xs text-brand-grey-400 font-synonym">
                          <span class="flex items-center gap-1">
                          <User size={12} />
                            <!-- {article.author} -->
                          </span>
                          <span class="flex items-center gap-1">
                          <Calendar size={12} />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          <span class="flex items-center gap-1">
                          <Eye size={12} />
                            {article.views} views
                          </span>
                          <span class="bg-brand-grey-50 text-brand-grey-500 px-2 py-1 rounded-full">
                            {article.categories}
                          </span>
                      </div>
                      </div>

                      <div class="flex items-center gap-3">
                      <!-- Status -->
                      <span class={`px-3 py-1 rounded-full text-xs font-synonym ${getStatusColor(article.status)}`}>
                          {article.status}
                      </span>

                      <!-- Actions -->
                      <div class="flex items-center gap-1">
                          <a
                          href={`/bits/admin/dashboard/articles/${article.id}/edit`}
                          class="p-2 text-brand-grey-400 hover:text-brand-blue-500 hover:bg-brand-blue-50 rounded-lg transition-colors"
                          title="Edit article"
                          >
                          <Edit size={16} />
                        </a>

                        <!-- Delete Article Modal -->
                        <Dialog.Root>
                          <Dialog.Trigger >
                            <button
                              onclick={() => articleToDelete = article.id}
                              class="p-2 text-brand-grey-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete article"
                            >
                              <Trash2 size={16} />
                            </button>
                          </Dialog.Trigger>

                          <Dialog.Content class="sm:max-w-md">
                            <Dialog.Header>
                              <Dialog.Title>Delete Article</Dialog.Title>
                              <Dialog.Description>
                                Are you sure you want to delete this article? This action cannot be undone.
                              </Dialog.Description>
                            </Dialog.Header>

                            <Dialog.Footer class="flex gap-2 justify-end">
                              <Dialog.Close >
                                <Button type="button" variant="outline">
                                  Cancel
                                </Button>
                              </Dialog.Close>

                              <!-- Form to submit deletion -->
                              <form method="POST" action="?/delete" class="inline"
                              use:enhance={() => {
                                loading = true;
                                return async ({ result }) => {
                                  loading = false;
                                  console.log(result);
      
                                  if (result.type === "failure" && result.data) {
                                    toast.info("Deleted Fail", {
                                      description: result.data?.error as string || "Unable to delete the article."
                                    });
                                  } else if (result.type === "error") {
                                    toast.info("Deleted Fail", {
                                      description: result?.error as string || "Unable to delete the article."
                                    });
                                  } else if (result.type === "success") {
                                    toast.success("Article deleted", {
                                      description: "The article has been removed successfully."
                                    });
                                    invalidateAll()
                                  }
                                };
                            }}
                              >
                                <input type="hidden" name="id" value={articleToDelete} />
                                <Button type="submit" class="bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
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

                        <button class="p-2 text-brand-grey-400 hover:text-brand-grey-500 hover:bg-brand-grey-50 rounded-lg transition-colors">
                        <MoreHorizontal size={16} />
                        </button>
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
      <div class="flex items-center justify-between bg-white rounded-xl p-4 border border-brand-grey-50">
          <p class="text-sm text-brand-grey-400 font-synonym">
          Showing {filteredArticles.length} of {articles.length} articles
          </p>
          <div class="flex items-center gap-2">
          <button class="px-3 py-2 text-sm font-synonym text-brand-grey-400 hover:text-brand-grey-500 disabled:opacity-50" disabled>
              Previous
          </button>
          <span class="px-3 py-2 text-sm font-synonym bg-brand-orange-500 text-white rounded-lg">
              1
          </span>
          <button class="px-3 py-2 text-sm font-synonym text-brand-grey-400 hover:text-brand-grey-500 disabled:opacity-50" disabled>
              Next
          </button>
          </div>
      </div>
    {/if}
</div>
  