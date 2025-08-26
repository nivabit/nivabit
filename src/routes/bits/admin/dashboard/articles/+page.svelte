<script lang="ts">
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
      FileText
    } from 'lucide-svelte';
  
    interface Article {
      id: number;
      title: string;
      excerpt: string;
      status: 'Published' | 'Draft' | 'Scheduled';
      category: string;
      author: string;
      publishDate: string;
      views: number;
      image?: string;
    }
  
    let searchTerm = '';
    let statusFilter = 'All';
    let selectedArticles: number[] = [];
  
    let articles: Article[] = [
      {
        id: 1,
        title: 'Getting Started with React Development',
        excerpt: 'Learn the fundamentals of React development including components, state management, and best practices for building modern web applications.',
        status: 'Published',
        category: 'Development',
        author: 'Admin User',
        publishDate: '2024-01-15',
        views: 1234,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/1d2f0f807704c4679e4542643fb50522e067e921?width=773'
      },
      {
        id: 2,
        title: 'Design Systems Best Practices',
        excerpt: 'Explore how to create and maintain effective design systems that scale across large organizations and multiple products.',
        status: 'Draft',
        category: 'Design',
        author: 'Admin User',
        publishDate: '2024-01-14',
        views: 0,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/b4421f0060262f137668b2c5963fe8ad107e907e?width=773'
      },
      {
        id: 3,
        title: 'Building Scalable Web Applications',
        excerpt: 'Discover architectural patterns and technologies for building web applications that can handle millions of users.',
        status: 'Published',
        category: 'Development',
        author: 'Admin User',
        publishDate: '2024-01-13',
        views: 856,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/50a4600f5b61ccf555acb851114d87f842faf285?width=773'
      },
      {
        id: 4,
        title: 'User Experience Research Methods',
        excerpt: 'A comprehensive guide to various UX research methods and when to use them in your product development process.',
        status: 'Scheduled',
        category: 'Research',
        author: 'Admin User',
        publishDate: '2024-01-20',
        views: 0,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/1d2f0f807704c4679e4542643fb50522e067e921?width=773'
      },
      {
        id: 5,
        title: 'Modern CSS Techniques for Better Performance',
        excerpt: 'Learn about CSS optimization techniques, CSS-in-JS, and modern layout methods for improved performance.',
        status: 'Published',
        category: 'Development',
        author: 'Admin User',
        publishDate: '2024-01-12',
        views: 642,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/b4421f0060262f137668b2c5963fe8ad107e907e?width=773'
      },
      {
        id: 6,
        title: 'The Future of Web Development',
        excerpt: 'Exploring emerging trends and technologies that will shape the future of web development over the next decade.',
        status: 'Draft',
        category: 'Technology',
        author: 'Admin User',
        publishDate: '2024-01-11',
        views: 0,
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/50a4600f5b61ccf555acb851114d87f842faf285?width=773'
      }
    ];
  
    $: filteredArticles = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || article.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  
    function handleSelectArticle(id: number) {
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
        selectedArticles = filteredArticles.map(article => article.id);
      }
    }
  
    function handleDeleteArticle(id: number) {
      if (confirm('Are you sure you want to delete this article?')) {
        articles = articles.filter(article => article.id !== id);
        selectedArticles = selectedArticles.filter(articleId => articleId !== id);
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
            <option value="Scheduled">Scheduled</option>
        </select>
        </div>

        <!-- Bulk Actions -->
        {#if selectedArticles.length > 0}
        <button
            on:click={handleBulkDelete}
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
            on:change={handleSelectAll}
            class="rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
        />
        <span class="text-sm font-synonym font-medium text-brand-grey-500">
            {filteredArticles.length} Articles
        </span>
        </div>
    </div>

    <!-- Articles Grid -->
    <div class="divide-y divide-brand-grey-50">
        {#if filteredArticles.length === 0}
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
                href="/dashboard/articles/create"
                class="inline-flex items-center gap-2 bg-brand-orange-500 text-white px-6 py-3 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 transition-colors"
            >
                <Plus size={18} />
                Create First Article
            </a>
            {/if}
        </div>
        {:else}
        {#each filteredArticles as article}
            <div class="p-6 hover:bg-bg-blue transition-colors">
            <div class="flex items-start gap-4">
                <!-- Checkbox -->
                <input
                type="checkbox"
                checked={selectedArticles.includes(article.id)}
                on:change={() => handleSelectArticle(article.id)}
                class="mt-1 rounded border-brand-grey-200 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
                />

                <!-- Article Image -->
                <div class="flex-shrink-0">
                <img
                    src={article.image}
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
                        {article.author}
                        </span>
                        <span class="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(article.publishDate).toLocaleDateString()}
                        </span>
                        <span class="flex items-center gap-1">
                        <Eye size={12} />
                        {article.views.toLocaleString()} views
                        </span>
                        <span class="bg-brand-grey-50 text-brand-grey-500 px-2 py-1 rounded-full">
                        {article.category}
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
                        href={`/dashboard/articles/${article.id}/edit`}
                        class="p-2 text-brand-grey-400 hover:text-brand-blue-500 hover:bg-brand-blue-50 rounded-lg transition-colors"
                        title="Edit article"
                        >
                        <Edit size={16} />
                        </a>
                        <button
                        on:click={() => handleDeleteArticle(article.id)}
                        class="p-2 text-brand-grey-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete article"
                        >
                        <Trash2 size={16} />
                        </button>
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
    {#if filteredArticles.length > 0}
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
  