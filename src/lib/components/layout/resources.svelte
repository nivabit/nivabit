<script lang="ts">
	import { goto } from "$app/navigation";
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import MainButton from "../customUI/button/MainButton.svelte";

  const articles = [
    {
      imageId: '1',
      categories: ['Design', 'Branding'],
      title: 'Blog Post Title Goes Here',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel sapien non nunc fringilla varius. Cras euismod, nunc nec fermentum gravida, nunc ligula fermentum odio, a dignissim mauris metus sit amet purus.'
    },
    {
      imageId: '2',
      categories: ['Design', 'Branding'],
      title: 'Blog Post Title Goes Here',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel sapien non nunc fringilla varius. Cras euismod, nunc nec fermentum gravida, nunc ligula fermentum odio, a dignissim mauris metus sit amet purus.'
    },
    {
      imageId: '3',
      categories: ['Design', 'Branding'],
      title: 'Blog Post Title Goes Here',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel sapien non nunc fringilla varius. Cras euismod, nunc nec fermentum gravida, nunc ligula fermentum odio, a dignissim mauris metus sit amet purus.'
    }
  ];
</script>
  
<section id="articles" class="bg-bg-blue px-4 md:px-16 py-16 md:py-24">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-16">
      <p use:reveal class="reveal text-brand-grey-500 text-lg mb-1">Resources</p>
      <h2 use:revealWords class="reveal-words text-3xl md:text-4xl lg:text-5xl font-medium text-brand-grey-500">
        Insights and Useful Articles
      </h2>
    </div>

    <!-- Article Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      {#each articles as article}
      <div
      use:reveal
      class="group reveal bg-brand-blue-50 border border-brand-blue-100 hover:border-brand-blue-500 rounded-2xl p-5 space-y-5 transition-colors duration-300 ease-in-out"
    >
      <!-- Image with hover scale -->
      <div class="h-60 w-full overflow-hidden rounded-lg relative">
        <img
          src={`/images/article${article.imageId}.png`}
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
          {article.description}
        </p>
    
        <!-- Button -->
        <button
          type="button"
          class="flip-button text-brand-blue-500 text-sm hover:underline hover:bg-transparent hover:text-brand-blue-700 transition-colors duration-300"
          onclick={() => goto("/articles/" + article.title)}
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

    <!-- View All Button -->
    <div use:reveal class="reveal text-center">
      <MainButton class="flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm  hover:bg-brand-orange-500/90 transition-colors mx-auto">
        View all articles
        <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
          <path
            d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z"
            fill="white"
          />
        </svg>
      </MainButton>
    </div>
  </div>
</section>
  