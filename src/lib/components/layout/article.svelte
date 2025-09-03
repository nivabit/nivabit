<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import MainButton from "../customUI/button/MainButton.svelte";
	import Button from "../ui/button/button.svelte";

  let { showHeader = false, limit = 10 } = $props();
  let articles = $derived(page?.data?.articles)

</script>
  
<section id="articles" class="bg-bg-blue px-4 md:px-16 py-16 md:py-24">
  <div class="max-w-7xl mx-auto">
    {#if showHeader}
      <div class="text-center mb-16">
        <p use:reveal class="reveal text-brand-grey-500 text-lg font-synonym mb-1">Resources</p>
        <h2 use:revealWords class="reveal-words text-3xl md:text-4xl lg:text-5xl font-cabinet font-medium text-brand-grey-500">
          Other Articles
        </h2>
      </div>
    {/if}

    {#if articles?.length <= 0}
      <div class="text-center md:py-16 py-10 flex flex-col items-center ">
        <img src="/icons/EmptyState.svg" alt="No articles" class="mx-auto md:w-72 w-36 h-36 md:h-72 sm:h-48 sm:w-48 opacity-70" />
        <h3 class="text-2xl font-medium text-brand-grey-500 mb-2">No articles found</h3>
        <p class="text-brand-grey-400 mb-6">Check back later for more content and updates.</p>
        <MainButton href="/" class="flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm  hover:bg-brand-orange-500/90 transition-colors flex-shrink-0 text-center">
          Go Home
        </MainButton>
      </div>
    {:else}
    <!-- Article Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {#each articles.slice(0, limit) as article}
      <div
      use:reveal
      class="group reveal bg-brand-blue-50 border border-brand-blue-100 hover:border-brand-blue-500 rounded-2xl p-5 space-y-5 transition-colors duration-300 ease-in-out"
    >
      <!-- Image with hover scale -->
      <div class="h-60 w-full overflow-hidden rounded-lg relative">
        <img
          src={`${article.featuredImage}`}
          alt="Blog Post"
          class="w-full h-full object-cover rounded-lg transform transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
    
      <div class="space-y-5">
        <!-- Category Tags -->
        <div class="flex gap-3 flex-wrap">
          {#each article.categories as category}
            <span
              class="bg-bg-blue text-brand-grey-500 px-5 py-2 rounded-full text-sm transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white"
            >
              {category}
            </span>
          {/each}
        </div>
    
        <!-- Title -->
        <h3 class="text-xl font-medium text-brand-grey-500 group-hover:text-brand-orange-500 transition-colors duration-300">
          {article.title}
        </h3>
    
        <!-- Description -->
        <p class="text-brand-grey-400 text-sm leading-relaxed line-clamp-2 group-hover:text-brand-grey-500 transition-colors duration-300">
          {article.excerpt}
        </p>
    
        <!-- Button -->
        <button
          type="button"
          class="flip-button text-brand-blue-500 text-sm hover:underline hover:bg-transparent hover:text-brand-blue-700 transition-colors duration-300"
          onclick={() => goto("/articles/" + article.id)}
        >
          <span class="slide-text">
            <span class="text-top">Read Blog</span>
            <span class="text-bottom">Read Blog</span>
          </span>
        </button>
      </div>
    </div>
    
      {/each}
    </div>
    {/if}
  </div>
</section>
  