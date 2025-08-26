<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import MainButton from "$lib/components/customUI/button/MainButton.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import { ArrowRight } from "lucide-svelte";

</script>

<div class="min-h-screen h-full bg-bg-orange">
    <Header />
    <section class="bg-brand-blue-900 px-4 md:px-16 pt-24 md:pt-32 pb-16 md:pb-24 h-full flex items-center">
        <div class="max-w-4xl mx-auto text-center">
            <div use:reveal class="reveal">
                <h1 use:revealWords class="reveal-words text-6xl md:text-8xl lg:text-9xl font-cabinet font-bold text-white mb-8">
                    404
                </h1>
            </div>
            
            <h2 use:reveal class="reveal text-2xl md:text-3xl lg:text-4xl font-cabinet text-white mb-6">
                Page Not Found
            </h2>
            
            <p use:reveal class="reveal text-lg text-white font-synonym mb-10 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            <div use:reveal class="reveal">
                <MainButton
                href="/"
                class="inline-flex items-center gap-2 bg-brand-orange-500 text-white px-6 py-4 rounded-full text-lg font-synonym hover:bg-brand-orange-500/90 transition-colors"
                >
                    Back to Home
                    <ArrowRight />
                </MainButton>
            </div>
        </div>
    </section>
</div>