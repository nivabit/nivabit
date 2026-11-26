<script lang="ts">
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import {
		FileText,
		LayoutDashboard,
		Mail,
		Users,
		Calendar,
		TrendingUp,
		MessageSquare,
		Layers
	} from 'lucide-svelte';
	import { page } from '$app/state';
	import NivabitLogo from '#lib/components/icon/NivabitLogo.svelte';

	let navMain = $derived([
		{
			title: 'Command Center',
			url: '/ceo',
			icon: LayoutDashboard,
			current: page.url.pathname === '/ceo'
		},
		{
			title: 'Articles & Content',
			url: '/ceo/articles',
			icon: FileText,
			current: page.url.pathname.startsWith('/ceo/articles')
		},
		{
			title: 'Strategy Bookings',
			url: '/ceo/bookings',
			icon: Calendar,
			current: page.url.pathname.startsWith('/ceo/bookings')
		},
		{
			title: 'Subscribers',
			url: '/ceo/subscribers',
			icon: Users,
			current: page.url.pathname.startsWith('/ceo/subscribers')
		},
		{
			title: 'Send Newsletter',
			url: '/ceo/newsletter',
			icon: Mail,
			current: page.url.pathname.startsWith('/ceo/newsletter')
		},
		{
			title: 'Platform Metrics',
			url: '/ceo/metrics',
			icon: TrendingUp,
			current: page.url.pathname.startsWith('/ceo/metrics')
		},
		{
			title: 'Inquiries & Leads',
			url: '/ceo/messages',
			icon: MessageSquare,
			current: page.url.pathname.startsWith('/ceo/messages')
		}
	]);

	const navSecondary = [
		{
			title: 'Account Settings',
			url: '/ceo/settings',
			icon: SettingsIcon
		}
	];

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps} class="bg-[#090d14] border-r border-white/10">
	<Sidebar.Header class="bg-[#090d14] border-b border-white/5 py-4 px-4">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<a href="/ceo" class="flex items-center gap-2.5 transition-opacity hover:opacity-85">
					<NivabitLogo variant="light" class="h-6 w-auto" />
				</a>
				<div class="mt-2 flex items-center gap-1.5 pl-0.5">
					<span class="h-1.5 w-1.5 rounded-[1px] bg-[#0284c7]"></span>
					<span class="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
						CEO Command Suite
					</span>
				</div>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content class="bg-[#090d14] text-white">
		<NavMain items={navMain} />
		<NavSecondary items={navSecondary} class="mt-auto" />
	</Sidebar.Content>

	<Sidebar.Footer class="bg-[#090d14] border-t border-white/5 text-white">
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
