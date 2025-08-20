<!-- EnhancedProgressSpinner.svelte -->
<script lang="ts">
	import { navigating } from '$app/state';
	import { loader } from '$lib/stores/loader';

	interface Props {
		height?: 'thin' | 'normal' | 'thick';
		color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'primary';
		showShimmer?: boolean;
		minDuration?: number;
		speed?: number;
		showLoading?: boolean;
	}

	let {
		height = 'normal',
		color = 'primary',
		showShimmer = true,
		minDuration = 300,
		speed = 100
	}: Props = $props();

	let progress = $state(0);
	let isVisible = $state(false);
	let progressInterval: NodeJS.Timeout;
	let startTime = $state(0);

	// Tailwind height classes
	const heightClasses = {
		thin: 'h-0.5',
		normal: 'h-1',
		thick: 'h-2'
	};

	// Tailwind color classes
	const colorClasses = {
		blue: 'from-blue-500 to-cyan-500',
		green: 'from-green-500 to-emerald-500',
		purple: 'from-purple-500 to-pink-500',
		orange: 'from-orange-500 to-red-500',
		red: 'from-red-500 to-pink-500',
		primary: 'from-primary to-secondary',
	};

	// Reactive effect to handle navigation state
	$effect(() => {
		async function handleNavigation() {
			if (navigating.type === "link" || navigating.type === "form" || navigating.type === "goto") {
				startProgress();
				await navigating.complete;
			} 
		}
		handleNavigation();
		completeProgress();
	});


	$effect(() => {
		if ($loader) {
			startProgress();
		} else {
			completeProgress();
		}
	});

	function startProgress() {
		isVisible = true;
		progress = 0;
		startTime = Date.now();
		
		progressInterval = setInterval(() => {
			if (progress < 20) {
				progress += Math.random() * 15;
			} else if (progress < 50) {
				progress += Math.random() * 8;
			} else if (progress < 80) {
				progress += Math.random() * 3;
			} else if (progress < 95) {
				progress += Math.random() * 1;
			}
			
			if (progress > 95) progress = 95;
		}, speed);
	}

	function completeProgress() {
		if (progressInterval) {
			clearInterval(progressInterval);
		}
		
		if (isVisible) {
			const elapsed = Date.now() - startTime;
			progress = 100;
			
			const remainingTime = Math.max(0, minDuration - elapsed);
			
			setTimeout(() => {
				isVisible = false;
				progress = 0;
			}, remainingTime + 200);
		}
	}

	// Cleanup effect
	$effect(() => {
		return () => {
			if (progressInterval) {
				clearInterval(progressInterval);
			}
		};
	});
</script>

{#if isVisible}
	<div class="fixed top-0 left-0 right-0 {heightClasses[height]} bg-gray-200 dark:bg-gray-800 z-50 overflow-hidden">
		<div 
			class="h-full bg-gradient-to-r {colorClasses[color]} transition-all duration-200 ease-out relative overflow-hidden shadow-sm"
			style="width: {progress}%"
		>
			{#if showShimmer}
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
	
	.animate-shimmer {
		animation: shimmer cubic-bezier(0.55, 0.055, 0.675, 0.19) 3s infinite;
	}
</style>