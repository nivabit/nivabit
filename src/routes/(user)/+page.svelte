<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import MainButton from "$lib/components/customUI/button/MainButton.svelte";
	import ContactUs from "$lib/components/layout/contactUs.svelte";
	import Hero from "$lib/components/layout/Hero.svelte";
	import Newsletter from "$lib/components/layout/newsletter.svelte";
	import Process from "$lib/components/layout/process.svelte";
	import Resources from "$lib/components/layout/resources.svelte";
  import Motion from 'motion-svelte';
  import { onMount } from 'svelte';

  // Image IDs for scrolling section
  const imageIds = [
    '/images/Project-1.png',
    '/images/Project-2.png',
    '/images/Project-3.png',
    '/images/Project-4.png',
    '/images/Project-5.png',
  ];

  const services = [
    {
      number: "01",
      title: "Product Design",
      services: ["Saas Platform", "Web Platform", "Mobile App"],
      desc: "We transform ideas into intuitive, high-performing products users love. Through strategic UX/UI design, we create seamless digital experiences that drive engagement, retention, and business growth."
    },
    {
      number: "02",
      title: "Brand Design",
      services: ["Startup Branding", "Rebranding", "Brand Collateral"],
      desc: "Your brand is your story - we help you tell it powerfully. From logos to full visual identities, we craft distinctive branding that resonates with your audience and stands out in competitive markets."
    },
    {
      number: "03",
      title: "Web Development",
      services: ["Business Websites", "E-Commerce Stores", "Web Applications"],
      desc: "Websites that work as hard as you do. We build responsive, secure, and high-converting digital platforms optimized for performance, search visibility, and user experience across all devices."
    },
    {
      number: "04",
      title: "Project Research",
      services: ["Market Validation", "User Behavior Analysis", "Competitive Audits"],
      desc: "Data-driven decisions start here. Our comprehensive market and user research provides the insights you need to validate concepts, minimize risks, and position your project for maximum impact."
    },
    {
      number: "05",
      title: "Product Development",
      services: ["Custom SaaS Development", "ERP Integration", "Internal Tools"],
      desc: "Custom digital solutions that streamline your operations. We design and develop tailored software systems that automate workflows, integrate processes, and give you the competitive edge to scale efficiently."
    }
  ];

  const projects = [
    {
      title: "Fermerce",
      duration: "6 weeks",
      type: "Website",
      category: "Ecommerce",
      image: "/images/portfolio2.png"
    },
    {
      title: "Padetunes",
      duration: "8 weeks",
      type: "WebApp",
      category: "Music",
      image: "/images/portfolio1.png"
    },
    {
      title: "Mr. Olusola's Website",
      duration: "4 weeks",
      type: "Website",
      category: "Personal",
      image: "/images/portfolio4.png"
    },
  ];

  let testimonials = [
    {
    message: `A team of passionate innovators dedicated to bringing your digital dreams to life. With years of experience and a commitment to excellence. We collaborate closely with our clients to deliver impactful solutions that drive success.`,
    name: "Owonikoko Olaoluwa",
    role: "CEO, Nivabit",
    image: "/images/profile1.png"
    },
    {
    message: `Nivabit transformed our vision into a stunning product. Their process was transparent, efficient, and always client-first.`,
    name: "Grace Adebayo",
    role: "Founder, Grace Inc.",
    image: "/images/profile2.jpg"
    },
    {
    message: `They’re not just developers – they’re strategic partners who care deeply about results. We saw a 40% increase in user engagement.`,
    name: "Chuka Obi",
    role: "CTO, Finlit Africa",
    image: "/images/profile3.jpg"
    }
  ];

  let current = $state(0);
  let direction = $state(1);
  let mounted = $state(false);
  let activeServiceIndex: number | null = $state(null);

  function toggleService(index: number) {
    activeServiceIndex = activeServiceIndex === index ? null : index;
  }

  function next() {
    direction = 1;
    current = (current + 1) % testimonials.length;
  }

  function prev() {
    direction = -1;
    current = (current - 1 + testimonials.length) % testimonials.length;
  }

  onMount(() => {
    mounted = true;
  });
</script>

<style>
  .next-section {
    margin-top: -100vh; /* Overlap the last step */
    z-index: 10;
    position: relative;
    background: white;
  }
</style>

<main>
    <Hero />
    <!-- Horizontal Project Showcase -->
    <section class="bg-brand-blue-900 py-8 md:py-12 ">
      <div use:reveal class="overflow-hidden reveal">
        <div class="flex animate-scroll space-x-3 md:space-x-5">
            {#each Array(10) as _, i}
            <div class="flex-shrink-0">
              <img
                src={imageIds[i % imageIds.length]}
                alt={`Project ${i + 1}`}
                class="w-64 md:w-80 h-64 md:h-80 object-cover rounded-2xl"
              />
            </div>
            {/each}
        </div>
      </div>
    </section>

    <!-- {/* Trusted By Section */} -->
    <section class="bg-brand-blue-900 px-4 md:px-16 pb-16 md:pb-24">
      <div class="max-w-7xl mx-auto text-center overflow-hidden">
        <p class="text-lg  mb-10">
          <span use:revealWords class="reveal-words text-white">Trusted by </span>
          <span use:revealWords class="reveal-words text-brand-orange-500">visionaries</span>
        </p>
    
        <div use:reveal class="reveal flex justify-between items-center opacity-50 space-x-8 md:space-x-16">
          {#each Array(6) as _, i}
            <img
              src={`/images/clients/${i + 1}.png`}
              alt={`Logo ${i + 1}`}
              class="h-8 w-auto opacity-75 hover:opacity-100 transition-opacity"
            />
          {/each}
        </div>
      </div>
    </section>

    <!-- {/* About Us Section */} -->
    <section id="about" class="bg-bg-orange px-4 md:px-16 py-16 md:py-24">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-end">
            <div use:reveal class="reveal w-full lg:w-96 flex-shrink-0 self-start">
              <p class="text-brand-grey-500 text-lg ">About us</p>
            </div>
            
            <div class="flex-1">
              <div class="space-y-10">
                <h2 use:revealWords class="reveal-words text-[32px] md:text-[42px] text-brand-grey-500">
                  A team of passionate innovators dedicated to bringing your digital dreams to life. With years of experience and a commitment to excellence. We collaborate closely with our clients to deliver impactful solutions that drive success.
                </h2>
                
                <div use:reveal class="reveal text-center">
                  <MainButton class="flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm hover:bg-brand-orange-500/90 transition-colors">
                    Get Started
                    <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                      <path d="M2.66602 8.03777V9.3711H10.666L6.99935 13.0378L7.94602 13.9844L13.226 8.70444L7.94602 3.42444L6.99935 4.37111L10.666 8.03777H2.66602Z" fill="white"/>
                    </svg>
                  </MainButton>
                </div>
                
              </div>
            </div>
          </div>
        </div>
    </section>
      
    <!-- {/* Services Section */} -->
    <section id="services" class="bg-bg-orange px-4 md:px-16 py-16 md:py-24">
        <div class="max-w-7xl mx-auto">
          <!-- Services Header -->
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-end mb-16">
            <div use:reveal class="reveal w-full lg:w-96 flex-shrink-0">
              <p class="text-brand-grey-500 text-lg ">Services</p>
            </div>
      
            <div class="flex-1">
              <h2 use:revealWords class="reveal-words text-3xl md:text-4xl lg:text-5xl  text-brand-grey-500 leading-[1.3]">
                We offer a range of digital solutions tailored to your business needs.
              </h2>
            </div>
          </div>
      
          <!-- Services List -->
          <div class="space-y-0">
            {#each services as service, index}
              <button type="button" use:reveal class="reveal flex flex-col lg:flex-row gap-8 lg:gap-24 py-12 md:py-16 border-b border-brand-blue-100 w-full text-start" onclick={() => toggleService(index)}>
                <div class="w-full lg:w-96 flex-shrink-0">
                  <p class="text-brand-grey-500 text-lg ">{service.number}</p>
                </div>
      
                <div class="flex-1 space-y-10">
                  <h3 class="text-2xl md:text-3xl  font-bold text-brand-grey-500">
                    {service.title}
                  </h3>
      
                  <div class="flex flex-wrap items-center gap-3">
                    {#each service.services as item}
                      <div class="flex items-center gap-3">
                        <div class="w-1.5 h-1.5 rounded-full bg-brand-orange-500"></div>
                        <span class="text-brand-grey-500 text-lg ">{item}</span>
                      </div>
                    {/each}
                  </div>

                  {#if activeServiceIndex === index}
                    <div class="transition-display ease-in-out">
                      <p class="md:text-2xl text-lg font-normal text-brand-grey-500 mb-8">{service.desc}</p>
                      <MainButton variant="outline" class="flex items-center gap-2 px-5 py-3 rounded-full text-sm transition-colors bg-transparent border border-brand-blue-700">
                        Get Started
                        <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                          <path d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z" fill="#00042B"/>
                        </svg>
                      </MainButton>
                    </div>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        </div>
    </section>

    <!-- {/* Portfolio Section */} -->
    <section id="portfolio" class="bg-bg-blue px-4 md:px-16 py-16 md:py-24">
        <div class="max-w-7xl mx-auto">
          <!-- Portfolio Header -->
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-end mb-16">
            <div use:reveal class="reveal w-full lg:w-96 flex-shrink-0 self-start">
              <p class="text-brand-grey-500 text-lg ">Portfolio</p>
            </div>
      
            <div class="flex-1 space-y-10">
              <!-- Project Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
                {#each projects as project}
                  <div use:reveal class="reveal group hover:border-brand-blue-500 bg-brand-blue-50 border border-brand-blue-100 rounded-2xl p-5 space-y-10">
                    <div class="space-y-5">
                      <h3 class="text-2xl text-brand-grey-500 text-center">
                        {project.title}
                      </h3>
      
                      <div class="flex justify-center items-center gap-2 flex-wrap">
                        <span class="bg-bg-blue text-brand-blue-500 px-5 py-2 rounded-full text-sm transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white">
                          {project.duration}
                        </span>
                        
                        <span class="bg-bg-blue text-brand-blue-500 px-5 py-2 rounded-full text-sm transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white">
                          {project.type}
                        </span>
                        
                        <span class="bg-bg-blue text-brand-blue-500 px-5 py-2 rounded-full text-sm transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white">
                          {project.category}
                        </span>
                        
                      </div>
                    </div>
      
                    <div class="h-60 w-full overflow-hidden rounded-lg relative">
                      <img
                      src={project.image}
                      alt={project.title}
                      class="w-full h-full object-cover rounded-lg transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                    </div>
                  </div>
                {/each}
              </div>
      
              <!-- CTA Button -->
              <div use:reveal class="reveal text-center">
                <MainButton class="flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm  hover:bg-brand-orange-500/90 transition-colors">
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                    <path d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z" fill="white"/>
                  </svg>
                </MainButton>
              </div>
            </div>
          </div>
        </div>
    </section>

    <!-- {/* Process Section */} -->
    <Process />
    
    <section class="next-section">
      <!-- {/* Testimonials Section */} -->
      <section class="bg-bg-blue px-4 md:px-16 py-16 md:py-24">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-end">
            <!-- Label -->
            <div use:reveal class="reveal w-full lg:w-96 flex-shrink-0">
              <p class="text-brand-grey-500 text-lg ">Testimonial</p>
            </div>
      
            <!-- Dynamic Testimonial Content -->
            <div use:reveal class="reveal flex-1 space-y-16">
                {#if mounted}
                    {#key current}
                        <Motion
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        class="text-2xl md:text-3xl  text-brand-grey-500 leading-[1.3] min-h-[6rem]"
                        >
                        {testimonials[current].message}
                        </Motion>
                    {/key}
                {/if}
      
              <div class="flex items-center justify-between">
                <!-- Avatar & Name -->
                <div class="flex items-center gap-3">
                  <img
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                    class="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 class=" font-bold text-brand-grey-500">
                      {testimonials[current].name}
                    </h4>
                    <p class="text-sm text-brand-grey-500 ">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
      
                <!-- Navigation Buttons -->
                <div class="flex items-center gap-3">
                  <button
                    class="w-10 h-10 rounded-full border border-brand-blue-500 flex items-center justify-center"
                    onclick={prev}
                    aria-label="Previous Testimonial"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                      <path
                        d="M13.3334 7.53814V8.87147H5.33344L9.0001 12.5381L8.05344 13.4848L2.77344 8.2048L8.05344 2.9248L9.0001 3.87147L5.33344 7.53814H13.3334Z"
                        fill="#000A66"
                      />
                    </svg>
                  </button>
      
                  <button
                    class="w-10 h-10 rounded-full border border-brand-blue-500 bg-brand-blue-50 flex items-center justify-center"
                    onclick={next}
                    aria-label="Next Testimonial"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                      <path
                        d="M2.66602 7.53814V8.87147H10.666L6.99935 12.5381L7.94602 13.4848L13.226 8.2048L7.94602 2.9248L6.99935 3.87147L10.666 7.53814H2.66602Z"
                        fill="#000A66"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Resources />
    </section>
    
    <Newsletter />
    <ContactUs />
</main>