<script lang="ts">
  // import DashboardLayout from '$lib/components/DashboardLayout.svelte';
  import MainButton from '$lib/components/customUI/button/MainButton.svelte';
import { FileText, Users, Eye, MessageCircle, TrendingUp, Plus } from 'lucide-svelte';

  // Sample data - in a real app, this would come from an API
  const stats = [
    {
      name: 'Total Articles',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: FileText
    },
    {
      name: 'Total Views',
      value: '12,459',
      change: '+18%',
      changeType: 'increase',
      icon: Eye
    },
    {
      name: 'Comments',
      value: '157',
      change: '+23%',
      changeType: 'increase',
      icon: MessageCircle
    },
    {
      name: 'Active Users',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: Users
    }
  ];

  const recentArticles = [
    {
      id: 1,
      title: 'Getting Started with React Development',
      status: 'Published',
      views: 1234,
      date: '2024-01-15',
      category: 'Development'
    },
    {
      id: 2,
      title: 'Design Systems Best Practices',
      status: 'Draft',
      views: 0,
      date: '2024-01-14',
      category: 'Design'
    },
    {
      id: 3,
      title: 'Building Scalable Web Applications',
      status: 'Published',
      views: 856,
      date: '2024-01-13',
      category: 'Development'
    },
    {
      id: 4,
      title: 'User Experience Research Methods',
      status: 'Published',
      views: 642,
      date: '2024-01-12',
      category: 'Research'
    }
  ];
</script>


<section class="space-y-8">
  <!-- Welcome Section -->
  <div class="bg-brand-blue-900 rounded-2xl p-8 text-white">
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-cabinet font-medium mb-2">
          Welcome back, Admin!
        </h1>
        <p class="text-brand-blue-100 font-synonym">
          Here's what's happening with your content today.
        </p>
      </div>
      <MainButton
        href="/dashboard/articles/create"
        class="flex items-center gap-2 bg-brand-orange-500 text-white px-6 py-3 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 transition-colors"
      >
        <Plus size={18} />
        Create Article
      </MainButton>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat}
      <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-brand-blue-50 rounded-lg">
            <svelte:component this={stat.icon} class="h-5 w-5 text-brand-blue-500" />
          </div>
          <span
            class="text-sm font-synonym {stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}"
          >
            {stat.change}
          </span>
        </div>
        <div>
          <h3 class="text-2xl font-cabinet font-bold text-brand-grey-500 mb-1">
            {stat.value}
          </h3>
          <p class="text-brand-grey-400 font-synonym text-sm">{stat.name}</p>
        </div>
      </div>
    {/each}
  </div>

  <!-- Recent Articles & Quick Actions -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Recent Articles -->
    <div class="lg:col-span-2">
      <div class="bg-white rounded-xl border border-brand-grey-50">
        <div class="p-6 border-b border-brand-grey-50">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-cabinet font-medium text-brand-grey-500">
              Recent Articles
            </h2>
            <a
              href="/dashboard/articles"
              class="text-brand-orange-500 hover:text-brand-orange-500/80 font-synonym text-sm transition-colors"
            >
              View All
            </a>
          </div>
        </div>
        <div class="divide-y divide-brand-grey-50">
          {#each recentArticles as article}
            <div class="p-6 hover:bg-bg-blue transition-colors">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="font-cabinet font-medium text-brand-grey-500 mb-2">
                    {article.title}
                  </h3>
                  <div class="flex items-center gap-4 text-sm text-brand-grey-400 font-synonym">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span class="flex items-center gap-1">
                      <Eye size={14} />
                      {article.views.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span
                  class="px-3 py-1 rounded-full text-xs font-synonym {article.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}"
                >
                  {article.status}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="space-y-6">
      <!-- Quick Stats -->
      <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
        <h3 class="font-cabinet font-medium text-brand-grey-500 mb-4">Quick Stats</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-brand-grey-400 font-synonym text-sm">This Week</span>
            <span class="font-cabinet font-medium text-brand-grey-500">5 articles</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-brand-grey-400 font-synonym text-sm">This Month</span>
            <span class="font-cabinet font-medium text-brand-grey-500">18 articles</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-brand-grey-400 font-synonym text-sm">Total Views</span>
            <span class="font-cabinet font-medium text-brand-grey-500">12,459</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl p-6 border border-brand-grey-50">
        <h3 class="font-cabinet font-medium text-brand-grey-500 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <a
            href="/bits/admin/dashboard/articles/create"
            class="flex items-center gap-3 p-3 rounded-lg border border-brand-grey-50 hover:bg-bg-blue transition-colors"
          >
            <div class="p-2 bg-brand-orange-500/10 rounded-lg">
              <Plus class="h-4 w-4 text-brand-orange-500" />
            </div>
            <span class="font-synonym text-sm text-brand-grey-500">Create New Article</span>
          </a>

          <a
            href="/dashboard/articles"
            class="flex items-center gap-3 p-3 rounded-lg border border-brand-grey-50 hover:bg-bg-blue transition-colors"
          >
            <div class="p-2 bg-brand-blue-500/10 rounded-lg">
              <FileText class="h-4 w-4 text-brand-blue-500" />
            </div>
            <span class="font-synonym text-sm text-brand-grey-500">Manage Articles</span>
          </a>

          <a
            href="/dashboard/settings"
            class="flex items-center gap-3 p-3 rounded-lg border border-brand-grey-50 hover:bg-bg-blue transition-colors"
          >
            <div class="p-2 bg-brand-grey-400/10 rounded-lg">
              <TrendingUp class="h-4 w-4 text-brand-grey-400" />
            </div>
            <span class="font-synonym text-sm text-brand-grey-500">View Analytics</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
