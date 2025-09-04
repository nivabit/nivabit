<script lang="ts">
	import CreditCardIcon from '@tabler/icons-svelte/icons/credit-card';
	import DotsVerticalIcon from '@tabler/icons-svelte/icons/dots-vertical';
	import LogoutIcon from '@tabler/icons-svelte/icons/logout';
	import NotificationIcon from '@tabler/icons-svelte/icons/notification';
	import UserCircleIcon from '@tabler/icons-svelte/icons/user-circle';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Button from './ui/button/button.svelte';
	import { page } from '$app/state';

	const sidebar = Sidebar.useSidebar();
	let user = page?.data?.user;

	let getInitials = $derived.by(() => {
		if (!user?.name) return '??';
		const parts = user?.name.trim().split(' ');
		if (parts.length === 1) {
			return parts[0].charAt(0).toUpperCase();
		}

		return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
	});
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="size-8 rounded-lg grayscale">
							<!-- <Avatar.Image src={user?.avatar} alt={user.name} /> -->
							<Avatar.Fallback class="rounded-lg text-black">{getInitials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user?.name}</span>
							<span class="truncate text-xs text-muted-foreground">
								{user?.email}
							</span>
						</div>
						<DotsVerticalIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<!-- <Avatar.Image src={user.avatar} alt={user.name} /> -->
							<Avatar.Fallback class="rounded-lg">{getInitials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user?.name}</span>
							<span class="truncate text-xs text-muted-foreground">
								{user?.email}
							</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogoutIcon />
					<form method="POST" action="/bits/admin/auth/login?/logout">
						<Button variant="ghost" type="submit" class="btn">Log out</Button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
