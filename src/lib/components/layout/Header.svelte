<script lang="ts">
  import { Menu, X } from 'lucide-svelte';
  import { goto } from '$app/navigation';
	import { reveal } from '$lib/actions/reveal';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
	import CustomButton from '$lib/components/customUI/button/customButton.svelte';
	import MainButton from '../customUI/button/MainButton.svelte';
  
  let isMenuOpen = false;

  const closeMenu = () => {
    isMenuOpen = false;
  };

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = async (sectionId: string) => {
    const currentPath = get(page).url.pathname;

    if (currentPath === '/') {
      scrollToSection(sectionId);
    } else {
      // Navigate to home with query param
      goto(`/#${sectionId}`);
    }
  };

  // Run scroll if redirected to home with ?section=xyz
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionId = urlParams.get('section');

    if (sectionId) {
      // Wait a little for layout to be ready
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 200);
    }
  });
</script>
  
<header class="w-full px-4 md:px-16 py-5 bg-brand-blue-900 relative z-50">
    <div use:reveal class="reveal flex justify-between items-center">
      <!-- Logo -->
      <a href="/" class="flex items-center">
        <img 
          src="/images/nivabit.png" 
          alt="Nivabit Logo" 
          class="h-6 w-auto"
        />
      </a>
  
      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center space-x-8">
        <CustomButton  className="" href="/" onclick={() => handleNavClick('home')} > Home </CustomButton>
        <CustomButton  className="" href="#services" onclick={() => handleNavClick('services')} > Services </CustomButton>
        <CustomButton  className="" href="#about" onclick={() => handleNavClick('about')} > About us </CustomButton>
        <CustomButton  className="" href="/articles" > Article</CustomButton>
        <CustomButton  className="" href="#contact" onclick={() => handleNavClick('contact')} >Contact us </CustomButton>
      </nav>
  
      <!-- CTA Button & Mobile Menu Toggle -->
      <div class="flex items-center gap-4">
        <MainButton class="hidden lg:flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm font-synonym hover:bg-brand-orange-500/90 transition-colors">
          Book a Call
          <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
            <path d="M2.66602 7.83333V9.16667H10.666L6.99935 12.8333L7.94602 13.78L13.226 8.5L7.94602 3.22L6.99935 4.16667L10.666 7.83333H2.66602Z" fill="white"/>
          </svg>
        </MainButton>
  
        <!-- Mobile Menu Button -->
        <button class="lg:hidden text-white p-2" onclick={() => (isMenuOpen = !isMenuOpen)}>
          {#if isMenuOpen}
            <X size={24} />
          {:else}
            <Menu size={24} />
          {/if}
        </button>
      </div>
    </div>
  
    <!-- Mobile Navigation -->
    {#if isMenuOpen}
      <div class="lg:hidden absolute top-full left-0 w-full bg-brand-blue-900 border-t border-brand-blue-400">
        <nav class="flex flex-col p-4 space-y-4">
          <CustomButton  className="" href="/" onclick={() => {closeMenu(); handleNavClick('home');}} >Home</CustomButton>
          <CustomButton  className="" href="#services" onclick={() => {closeMenu(); handleNavClick('services')}} > Services</CustomButton>
          <CustomButton  className="" href="#about" onclick={() => {closeMenu(); handleNavClick('about')}} > About us</CustomButton>
          <CustomButton  className="" href="/articles"> Article</CustomButton>
          <CustomButton  className="" href="#contact" onclick={() => {closeMenu(); handleNavClick('contact')}} >Contact us </CustomButton>
          
          <MainButton class="flex items-center gap-2 bg-brand-orange-500 text-white px-5 py-3 rounded-full text-sm font-synonym hover:bg-brand-orange-500/90 transition-colors w-full">
            Book a Call
            <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
              <path d="M2.66602 7.83333V9.16667H10.666L6.99935 12.8333L7.94602 13.78L13.226 8.5L7.94602 3.22L6.99935 4.16667L10.666 7.83333H2.66602Z" fill="white"/>
            </svg>
          </MainButton>
        </nav>
      </div>
    {/if}
</header>
  