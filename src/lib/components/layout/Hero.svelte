<script lang="ts">
	import CircularText from "./circularText.svelte";
    import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";

</script>

<!-- {/* Hero Section */} -->
<section class="relative bg-brand-blue-900 px-4 md:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
    <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-end gap-12 lg:gap-24">
            <!-- {/* Hero Content */} -->
            <div class="flex-1 max-w-4xl">
                <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-cabinet font-medium leading-[1.1] mb-5">
                <span use:revealWords class="reveal-words text-white">We design and develop digital experiences that help </span>
                <span use:revealWords class="reveal-words text-brand-orange-500">businesses grow.</span>
                </h1>
                <p use:reveal class="reveal text-white text-lg font-synonym max-w-2xl leading-relaxed mb-0">
                Transform your digital aspirations into reality with Nivabit. We specialize in crafting bespoke digital solutions that elevate your brand and drive success.
                </p>
            </div>
            
            <!-- {/* Circular Text Element */} -->
            <div use:reveal class="reveal hidden lg:block flex-shrink-0">
                <CircularText />
            </div>
        </div>
    </div>
</section>