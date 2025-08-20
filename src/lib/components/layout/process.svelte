<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import Code from "../icon/code.svelte";
	import Design from "../icon/design.svelte";
	import Discovery from "../icon/discovery.svelte";
	import Kickoff from "../icon/kickoff.svelte";
	import Launch from "../icon/launch.svelte";
    import { fly } from 'svelte/transition';

    const processes = [
        {
        step: "Step 1",
        title: "Kickoff Meeting",
        description:
            "We begin with an in-depth collaborative session where we immerse ourselves in your business objectives, challenges, and aspirations to establish the perfect foundation for our partnership.",
        icon: Kickoff
        },
        {
        step: "Step 2",
        title: "Discovery Phase",
        description:
            "Through comprehensive market analysis, user research, and technical audits, we uncover critical insights that shape every decision moving forward, ensuring your solution is built on data rather than assumptions.",
        icon: Discovery
        },
        {
        step: "Step 3",
        title: "Design",
        description:
            "Our creative team transforms strategic insights into beautiful, functional designs through iterative prototyping, user testing, and refinement until every pixel aligns with your brand and business goals.",
        icon: Design
        },
        {
        step: "Step 4",
        title: "Develop",
        description:
            "Using agile development methodologies, we build robust, scalable solutions with clean code architecture while maintaining transparent communication through every sprint and milestone.",
        icon: Code
        },
        {
        step: "Step 5",
        title: "Launch",
        description:
            "We don't just deploy your project - we implement thorough quality assurance, performance optimization, and knowledge transfer to ensure you're fully equipped for long-term success and growth.",
        icon: Launch
        }
    ];
</script>


<section class="bg-bg-orange px-4 md:px-16 py-16 md:py-24">
    <div class="max-w-6xl mx-auto text-center">
      <div class="mb-10">
        <p use:reveal class="reveal text-brand-grey-500 text-lg font-synonym mb-1">The Nivabit Method</p>
        <h2 use:revealWords class="reveal-words text-3xl md:text-4xl lg:text-5xl font-cabinet font-medium text-brand-grey-500">
          Where Ideas Take Shape
        </h2>
      </div>
  
      <!-- Process Steps -->
      <div use:reveal class="reveal space-y-5;">
        {#each processes as process}
          <div class="bg-brand-blue-900 rounded-3xl p-10 max-w-[1000px] mx-auto" style="
          position: sticky;
          top: 80px;">
            <div class="border border-white border-dashed rounded-2xl p-8 md:p-16">
              <div class="flex flex-col md:flex-row gap-8 lg:gap-16 items-start justify-between">
                <div class="w-full lg:w-32 flex-shrink-0">
                  <p class="text-white text-lg font-synonym">{process.step}</p>
                </div>
  
                <div class="flex-1 space-y-16 md:max-w-[400px] w-full ">
                  <div class="">
                    <svelte:component this={process.icon} />
                  </div>
                  
                  <div class="space-y-5 text-center lg:text-left">
                    <h3 class="text-2xl md:text-3xl font-cabinet font-medium text-white">
                      {process.title}
                    </h3>
                    <p class="text-white text-lg font-synonym leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
</section>