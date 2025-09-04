<script lang="ts">
	import MainButton from '$lib/components/customUI/button/MainButton.svelte';
	import type { DashboardStats } from '$lib/types/article.type.js';
	import { FileText, Users, Eye, MessageCircle, TrendingUp, Plus } from 'lucide-svelte';

	let { data } = $props();

	let user = $state(data?.user);
	let statsData = $state(data?.stats) as DashboardStats;
	let recentArticles: any = $state(data?.articles);

	const stats = [
		{
			name: 'Total Articles',
			value: statsData?.data?.totalArticles,
			change: '+12%',
			changeType: 'increase',
			icon: FileText
		},
		{
			name: 'Total Views',
			value: statsData?.data?.totalViews,
			change: '+18%',
			changeType: 'increase',
			icon: Eye
		},
		{
			name: 'Total Admins',
			value: statsData?.data?.totalAdmins,
			change: '+23%',
			changeType: 'increase',
			icon: Users
		},
		{
			name: 'Unread Contacts',
			value: statsData?.data?.unreadContacts,
			change: '+5%',
			changeType: 'increase',
			icon: MessageCircle
		}
	];
</script>

<section class="space-y-8">
	<!-- Welcome Section -->
	<div class="rounded-2xl bg-brand-blue-900 p-8 text-white">
		<div class="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
			<div>
				<h1 class="font-cabinet mb-2 text-2xl font-medium lg:text-3xl">
					Welcome back, {user?.name}!
				</h1>
				<p class="font-synonym text-brand-blue-100">
					Here's what's happening with your content today.
				</p>
			</div>
			<MainButton
				href="/bits/admin/dashboard/articles/create"
				class="font-synonym flex items-center gap-2 rounded-lg bg-brand-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-orange-500/90"
			>
				<Plus size={18} />
				Create Article
			</MainButton>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			{@const Component = stat.icon}

			<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
				<div class="mb-4 flex items-center justify-between">
					<div class="rounded-lg bg-brand-blue-50 p-2">
						<Component />
					</div>
					<span
						class="font-synonym text-sm {stat.changeType === 'increase'
							? 'text-green-600'
							: 'text-red-600'}"
					>
						{stat.change}
					</span>
				</div>
				<div>
					<h3 class="font-cabinet mb-1 text-2xl font-bold text-brand-grey-500">
						{stat.value}
					</h3>
					<p class="font-synonym text-sm text-brand-grey-400">{stat.name}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Recent Articles & Quick Actions -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Recent Articles -->
		<div class="lg:col-span-2">
			<div class="rounded-xl border border-brand-grey-50 bg-white">
				<div class="border-b border-brand-grey-50 p-6">
					<div class="flex items-center justify-between">
						<h2 class="font-cabinet text-lg font-medium text-brand-grey-500">Recent Articles</h2>
						<a
							href="/bits/admin/dashboard/articles"
							class="font-synonym text-sm text-brand-orange-500 transition-colors hover:text-brand-orange-500/80"
						>
							View All
						</a>
					</div>
				</div>
				<div class="divide-y divide-brand-grey-50">
					{#each recentArticles as article}
						<div class="p-6 transition-colors hover:bg-bg-blue">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<h3 class="font-cabinet mb-2 font-medium text-brand-grey-500">
										{article.title}
									</h3>
									<div class="font-synonym flex items-center gap-4 text-sm text-brand-grey-400">
										<span>{article.categories?.[0]}</span>
										<span>•</span>
										<span
											>{new Date(
												article.publishDate || article.createdAt
											).toLocaleDateString()}</span
										>
										<span>•</span>
										<span class="flex items-center gap-1">
											<Eye size={14} />
											{article.views}
										</span>
									</div>
								</div>
								<span
									class="font-synonym rounded-full px-3 py-1 text-xs {article.status === 'Published'
										? 'bg-green-100 text-green-700'
										: 'bg-yellow-100 text-yellow-700'}"
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
			<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
				<h3 class="font-cabinet mb-4 font-medium text-brand-grey-500">Quick Stats</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="font-synonym text-sm text-brand-grey-400">This Week</span>
						<span class="font-cabinet font-medium text-brand-grey-500">5 articles</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="font-synonym text-sm text-brand-grey-400">This Month</span>
						<span class="font-cabinet font-medium text-brand-grey-500">18 articles</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="font-synonym text-sm text-brand-grey-400">Total Views</span>
						<span class="font-cabinet font-medium text-brand-grey-500">12,459</span>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
				<h3 class="font-cabinet mb-4 font-medium text-brand-grey-500">Quick Actions</h3>
				<div class="space-y-3">
					<a
						href="/bits/admin/dashboard/articles/create"
						class="flex items-center gap-3 rounded-lg border border-brand-grey-50 p-3 transition-colors hover:bg-bg-blue"
					>
						<div class="rounded-lg bg-brand-orange-500/10 p-2">
							<Plus class="h-4 w-4 text-brand-orange-500" />
						</div>
						<span class="font-synonym text-sm text-brand-grey-500">Create New Article</span>
					</a>

					<a
						href="/dashboard/articles"
						class="flex items-center gap-3 rounded-lg border border-brand-grey-50 p-3 transition-colors hover:bg-bg-blue"
					>
						<div class="rounded-lg bg-brand-blue-500/10 p-2">
							<FileText class="h-4 w-4 text-brand-blue-500" />
						</div>
						<span class="font-synonym text-sm text-brand-grey-500">Manage Articles</span>
					</a>

					<a
						href="/dashboard/settings"
						class="flex items-center gap-3 rounded-lg border border-brand-grey-50 p-3 transition-colors hover:bg-bg-blue"
					>
						<div class="rounded-lg bg-brand-grey-400/10 p-2">
							<TrendingUp class="h-4 w-4 text-brand-grey-400" />
						</div>
						<span class="font-synonym text-sm text-brand-grey-500">View Analytics</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
