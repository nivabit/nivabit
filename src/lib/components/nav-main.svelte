<script lang="ts">
	import CirclePlusFilledIcon from "@tabler/icons-svelte/icons/circle-plus-filled";
	import MailIcon from "@tabler/icons-svelte/icons/mail";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { Icon } from "@tabler/icons-svelte";

	let { items }: { items: { title: string; url: string; icon?: Icon }[] } = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupContent class="flex flex-col gap-2">
		<!-- <Sidebar.Menu>
			<Sidebar.MenuItem class="flex items-center gap-2">
				<Sidebar.MenuButton
					class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
					tooltipContent="Quick create"
				>
					<CirclePlusFilledIcon />
					<span>Quick Create</span>
				</Sidebar.MenuButton>
				<Button
					size="icon"
					class="size-8 group-data-[collapsible=icon]:opacity-0"
					variant="outline"
				>
					<MailIcon />
					<span class="sr-only">Inbox</span>
				</Button>
			</Sidebar.MenuItem>
		</Sidebar.Menu> -->
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton tooltipContent={item.title} class="py-6">
						<a
							href={item.url}
							role="button"
							class="flip-button text-white text-sm hover:underline hover:bg-transparent transition-colors duration-300 !block w-full"
						>
							<span class="slide-text h-20 w-full">
								<span class="text-top !flex items-center gap-2 w-full">
									{#if item.icon}
										<item.icon class="size-4" />
									{/if}
									<span>{item.title}</span>
								</span>
								<span class="text-bottom text-brand-orange-500 !flex items-center gap-2 w-full">
									{#if item.icon}
										<item.icon class="size-4" />
									{/if}
									<span>{item.title}</span>
								</span>
							</span>
						</a>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
