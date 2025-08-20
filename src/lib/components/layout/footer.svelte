<script lang="ts">
  import { reveal } from "$lib/actions/reveal";
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
	import { goto } from "$app/navigation";
	import Button from "../ui/button/button.svelte";
	import IconButton from "../ui/button/iconButton.svelte";
	import Twitter from "../icon/twitter.svelte";
	import Facebook from "../icon/facebook.svelte";
	import Linkedin from "../icon/linkedin.svelte";
	import Message from "../icon/message.svelte";
	import Call from "../icon/call.svelte";
	import CustomButton from "../ui/button/customButton.svelte";

  let iconFills: Record<string, string> = $state({
    twitter: "#ffffff",
    facebook: "#ffffff",
    linkedin: "#ffffff",
    message: "#ffffff",
    call: "#ffffff",
  });

  const contactDetails = [
    {
      name: "message",
      title:'Nivabit@gmail.com',
      icon: Message
    },
    {
      name: "call",
      title:'facebook',
      icon: Call
    },
  ];

  const socialLinks = [
    {
      name:'twitter',
      icon: Twitter
    },
    {
      name:'facebook',
      icon: Facebook
    },
    {
      name:'linkedin',
      icon: Linkedin
    }
  ];
  const quickLinks = ['Home', 'Services', 'About us', 'Contact us'];

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

<footer class="bg-brand-blue-900 border-t border-brand-blue-400">
  <!-- Main Footer -->
  <div class="px-4 md:px-16 py-16 md:py-24">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
      <!-- Logo & Description -->
      <div use:reveal class="reveal lg:col-span-2 space-y-8">
        <img
          src="/images/nivabit.png"
          alt="Nivabit Logo"
          class="h-7 w-auto"
        />
        <p class="text-brand-grey-50 text-sm  leading-relaxed max-w-sm">
          Ready to take the next step? Have questions about our services? We're here to help. Let's start building something incredible together.
        </p>

        <!-- Social Links -->
        <div class="flex gap-5">
          {#each socialLinks as social}
            <IconButton
              class="w-12 h-12 bg-brand-orange-500 rounded-full flex items-center justify-center"
              onmouseenter={() => iconFills[social.name] = "#00042B"}
              onmouseleave={() => iconFills[social.name] = "#ffffff"}
            >
              {@const Component = social.icon}
              <Component fill={iconFills[social.name]} />
            </IconButton>
          {/each}
        </div>
      </div>

      <!-- Quick Links -->
      <div use:reveal class="reveal space-y-4">
        <h4 class="text-white text-lg  font-medium">Quick Links</h4>
        <nav class="space-y-3">
          {#each quickLinks as link}
            <CustomButton title={link} className="" href="/" />
          {/each}
        </nav>
      </div>

      <!-- Contact Info -->
      <div use:reveal class="reveal space-y-4">
        <h4 class="text-white text-lg  font-medium">Contact us</h4>
        <p class="text-brand-grey-50 text-sm  leading-relaxed">
          Ready to take the next step? Have questions about our services? We're here to help. Let's start building something incredible together.
        </p>

        <div class="space-y-3">
          <!-- Email -->
          {#each contactDetails as contact}
          <div class="flex items-center gap-3">
              <IconButton
              class="w-12 h-12 bg-brand-orange-500 rounded-full flex items-center justify-center"
              onmouseenter={() => iconFills[contact.name] = "#00042B"}
              onmouseleave={() => iconFills[contact.name] = "#ffffff"}
            >
              {@const Component = contact.icon}
              <Component fill={iconFills[contact.name]} />
            </IconButton>
            <span class="text-brand-grey-50 text-sm ">{contact.title}</span>
          </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Footer Bottom -->
  <div use:reveal class="reveal border-t border-brand-blue-400 px-4 md:px-16 py-8">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-white text-sm ">
        © Nivabit 2025. All rights reserved
      </p>

      <div class="flex gap-8">
        <CustomButton title="Privacy Policy" className="" />
        <CustomButton title="Terms of Service" className="" />
      </div>
    </div>
  </div>
</footer>  