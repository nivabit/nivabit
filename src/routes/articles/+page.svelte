<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import Article from "$lib/components/layout/article.svelte";
	import CircularText from "$lib/components/layout/circularText.svelte";
	import ContactUs from "$lib/components/layout/contactUs.svelte";
	import Hero from "$lib/components/layout/Hero.svelte";
	import Newsletter from "$lib/components/layout/newsletter.svelte";


</script>

<main>
    <!-- {/* Hero Section */} -->
    <section class="relative bg-brand-blue-900 px-4 md:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col lg:flex-row justify-between items-end gap-12 lg:gap-24">
                <!-- {/* Hero Content */} -->
                <div class="flex-1 max-w-4xl">
                    <h1 use:revealWords class="reveal-words text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] mb-5 text-white">
                        Our Articles
                    </h1>
                    <p use:reveal class="reveal text-white text-lg  max-w-2xl leading-relaxed mb-0">
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
    <Article />
    <Newsletter class="bg-bg-orange" />
    <ContactUs />
</main>