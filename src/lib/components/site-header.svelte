<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Bell } from 'lucide-svelte';
</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<h1 class="text-base font-medium">Documents</h1>
		<div class="ml-auto flex items-center gap-2">
			<button class="relative p-2 text-brand-grey-400 transition-colors hover:text-brand-grey-500">
				<Bell size={20} />
				<span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
			</button>

			<a
				href="/"
				class="font-synonym text-sm text-brand-grey-400 transition-colors hover:text-brand-grey-500"
			>
				View Website
			</a>
		</div>
	</div>
</header>
