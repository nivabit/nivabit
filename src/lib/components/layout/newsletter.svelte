<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import { cn } from "$lib/utils";
	import MainButton from "../customUI/button/MainButton.svelte";
	import Input from "../ui/input/input.svelte";

    let { class: customClass = '' } = $props();

</script>

<!-- {/* Newsletter Section */} -->
<section class={cn(`bg-bg-blue px-4 md:px-16 py-16 md:py-24`, customClass)}>
    <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        <div use:reveal class="reveal w-full lg:w-96 flex-shrink-0">
            <p class="text-brand-grey-500 text-lg ">Newsletter</p>
        </div>

        <div class="flex-1 space-y-10">
            <div>
            <h2 use:revealWords class="reveal-words text-2xl md:text-3xl  font-medium text-brand-grey-500 mb-3">
                Get Our Latest Insights on Topics
            </h2>
            <p use:reveal class="reveal text-brand-grey-500 text-lg leading-relaxed">
                Our creative team transforms strategic insights into beautiful, functional designs through iterative prototyping, user testing, and refinement until every pixel aligns with your brand and business goals.
            </p>
            </div>

            <div use:reveal class="reveal flex gap-3 max-w-lg bg-white rounded-full p-1 items-center">
                <Input
                    type="email"
                    placeholder="Your Email"
                    class="flex-1 bg-white border-none rounded-full px-5 py-3 text-brand-grey-500  placeholder:text-text-grey focus:outline-none focus:ring-none focus:ring-brand-orange-500 shadow-none focus-visible:outline-none focus:border-none"
                />
                <MainButton class="flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm  hover:bg-brand-orange-500/90 transition-colors flex-shrink-0">
                    Subscribe
                    <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                    <path d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z" fill="white"/>
                    </svg>
                </MainButton>
            </div>
        </div>
        </div>
    </div>
</section>