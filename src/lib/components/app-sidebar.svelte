<script lang="ts">
	import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { FileText, LayoutDashboard, Mail } from 'lucide-svelte';
	import { page } from '$app/state';

	const data: any = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		navMain: [
			{
				title: 'Dashboard',
				url: '/bits/admin/dashboard',
				icon: LayoutDashboard,
				current: page.url.pathname.startsWith('/bits/admin/dashboard')
			},
			{
				title: 'Articles',
				url: '/bits/admin/dashboard/articles',
				icon: FileText,
				current: page.url.pathname.startsWith('/bits/admin/dashboard/articles')
			},
			{
				title: 'Analytics',
				url: '/bits/admin/dashboard/analytics',
				icon: ChartBarIcon,
				current: page.url.pathname.startsWith('/bits/admin/dashboard/analytics')
			},
			{
				title: 'Messages',
				url: '/bits/admin/dashboard/messages',
				icon: Mail,
				current: page.url.pathname.startsWith('/bits/admin/dashboard/messages')
			},
			{
				title: 'Newsletter',
				url: '/bits/admin/dashboard/newsletter',
				icon: Mail,
				current: page.url.pathname.startsWith('/bits/admin/dashboard/newsletter')
			}
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '/bits/admin/dashboard/settings',
				icon: SettingsIcon
			}
		]
	};

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps} class="bg-brand-blue-900">
	<Sidebar.Header class="bg-brand-blue-900">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<img src="/images/logo.png" alt="logo" />
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content class="bg-brand-blue-900 text-white">
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer class="bg-brand-blue-900 text-white">
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
