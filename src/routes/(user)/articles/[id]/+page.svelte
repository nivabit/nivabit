<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import Article from "$lib/components/layout/article.svelte";
	import CircularText from "$lib/components/layout/circularText.svelte";
	import ContactUs from "$lib/components/layout/contactUs.svelte";
	import Hero from "$lib/components/layout/Hero.svelte";
	import Newsletter from "$lib/components/layout/newsletter.svelte";
	import RichTextEditor from "$lib/components/layout/RichTextEditor.svelte";

  const { data } = $props()

  let singleArticles: any = data?.singleArticles
  
</script>

<main>
  <!-- {/* Hero Section */} -->
  <section class="bg-brand-blue-900 px-6 lg:px-15 py-25 lg:py-40">
    <div class="max-w-4xl mx-auto text-center">
      <div class="flex justify-center items-center gap-3 mb-10">
        {#each singleArticles?.categories as category}
          <span use:reveal class="reveal bg-bg-blue text-brand-grey-500 px-5 py-2.5 rounded-full text-sm ">
            {category}
          </span>
        {/each}
      </div>
        <h1 use:revealWords class="reveal-words text-white text-4xl lg:text-7xl  font-medium leading-[110%] mb-6 max-w-[911px] mx-auto">
          {singleArticles?.title}
        </h1>
        <p use:reveal class="reveal text-white text-base lg:text-lg  leading-[160%] max-w-[677px] mx-auto">
          {singleArticles?.excerpt}
        </p>
    </div>
  </section>

  <!-- {/* Main Content */} -->
  <section class="px-6 lg:px-[250px] py-12 lg:py-25 bg-bg-blue">
    <div class="max-w-none mx-auto">
      <!-- {/* Hero Image */} -->
      <img 
        use:reveal
        src={singleArticles?.featuredImage}
        alt="Hero" 
        class="reveal w-full h-[475px] object-cover rounded-[40px] mb-10"
      />

      <!-- {/* Article Content */} -->
      <div use:reveal class="reveal space-y-12">
        <RichTextEditor bind:value={singleArticles.content} readOnly={true} />
      </div>
    </div>
  </section>
    
  <Article showHeader={true} limit={3} />
  <Newsletter class="bg-bg-orange" />
  <ContactUs />
</main>


