<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import Button from "../ui/button/button.svelte";

  let selectedService = $state('Design');
  const services = ['Design', 'Development', 'Research', 'Others'];

  function selectService(service: string) {
    selectedService = service;
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    // Handle form submission here (e.g., send to backend or use SvelteKit form actions)
  }
</script>

  <section id="contact" class="bg-brand-blue-900 px-4 md:px-16 py-16 md:py-24">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-end">
        <div use:reveal class="reveal w-full lg:w-96 flex-shrink-0 self-start">
          <p class="text-white text-lg ">Contact us</p>
        </div>
  
        <div class="flex-1 space-y-16">
          <h2 use:revealWords class="reveal-words text-2xl md:text-3xl font-cabinet font-medium text-white">
            Tell us about your project
          </h2>
  
          <form class="space-y-10" >
            <!-- Service Selection -->
            <div use:reveal class="reveal">
              <label for="" class="text-white text-lg  block mb-3">Choose service</label>
              <div class="flex flex-wrap gap-5">
                {#each services as service}
                <button
                type="button"
                class={`flip-button px-5 py-3 rounded-full text-sm flex items-center justify-center flex-col border transition-colors relative overflow-hidden ${
                  selectedService === service
                    ? 'bg-white text-brand-blue-500 border-bg-blue'
                    : 'text-brand-blue-100 border-brand-blue-50'
                }`}
                onclick={() => selectService(service)}
              >
                <span class={`${selectedService === service ? "" :"slide-text"}`}>
                  <span class={`${selectedService === service ? "" : "text-top text-brand-blue-100"}`}>{service}</span>
                  <span class="text-bottom text-white">{service}</span>
                </span>
              </button>
                {/each}
              </div>
            </div>
  
            <!-- Name and Email -->
            <div use:reveal>
              <label for="" class="reveal text-white text-lg  block mb-3">Name</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="John Doe"
                  class="bg-transparent border border-bg-blue rounded-full px-5 py-3 text-brand-grey-200  placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  class="bg-transparent border border-bg-blue rounded-full px-5 py-3 text-brand-grey-200  placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500"
                />
              </div>
            </div>
  
            <!-- Message -->
            <div use:reveal class="reveal">
              <label for="" class="text-white text-lg  block mb-3">Message</label>
              <textarea
                rows={6}
                placeholder="Your Message"
                class="w-full bg-transparent border border-bg-blue rounded-2xl px-5 py-5 text-brand-grey-200  placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 resize-none"
              ></textarea>
            </div>
  
            <!-- Submit Button -->
            <div use:reveal class="reveal">
              <Button
                type="submit"
                class="flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm  hover:bg-brand-orange-500/90 transition-colors"
              >
                Submit
                <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                  <path
                    d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z"
                    fill="white"
                  />
                </svg>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
</section>
  