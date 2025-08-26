<script lang="ts">
	import { reveal } from "$lib/actions/reveal";
	import { revealWords } from "$lib/actions/revealWords";
	import Article from "$lib/components/layout/article.svelte";
	import CircularText from "$lib/components/layout/circularText.svelte";
	import ContactUs from "$lib/components/layout/contactUs.svelte";
	import Hero from "$lib/components/layout/Hero.svelte";
	import Newsletter from "$lib/components/layout/newsletter.svelte";


</script>

<main>
    <!-- {/* Hero Section */} -->
    <section class="bg-brand-blue-900 px-6 lg:px-15 py-25 lg:py-40">
        <div class="max-w-4xl mx-auto text-center">
            <div class="flex justify-center items-center gap-3 mb-10">
            <span use:reveal class="reveal bg-bg-blue text-brand-grey-500 px-5 py-2.5 rounded-full text-sm ">
                Design
            </span>
            <span use:reveal class="reveal bg-bg-blue text-brand-grey-500 px-5 py-2.5 rounded-full text-sm ">
                Branding
            </span>
            </div>
            <h1 use:revealWords class="reveal-words text-white text-4xl lg:text-7xl  font-medium leading-[110%] mb-6 max-w-[911px] mx-auto">
            Blog Post Title Goes Here
            </h1>
            <p use:reveal class="reveal text-white text-base lg:text-lg  leading-[160%] max-w-[677px] mx-auto">
            Transform your digital aspirations into reality with Nivabit. We specialize in crafting bespoke digital solutions that elevate your brand and drive success.
            </p>
        </div>
    </section>

    <!-- {/* Main Content */} -->
      <section class="px-6 lg:px-[250px] py-12 lg:py-25 bg-bg-blue">
        <div class="max-w-none mx-auto">
          <!-- {/* Hero Image */} -->
          <img 
          use:reveal
            src="/images/Project Card Wrapper.png" 
            alt="Hero" 
            class="reveal w-full h-[475px] object-cover rounded-[40px] mb-10"
          />

          <!-- {/* Article Content */} -->
          <div class="space-y-12">
            <!-- {/* Introduction */} -->
            <div class="space-y-8">
              <p use:reveal class="reveal text-brand-grey-400 text-lg  leading-[160%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper mattis lorem non. Ultrices praesent amet ipsum justo massa. Eu dolor aliquet risus gravida nunc at feugiat consequat purus. Non massa enim vitae duis mattis. Vel in ultricies vel fringilla.
              </p>
              <hr class="border-gray-200" />
            </div>

            <!-- {/* Introduction Section */} -->
            <section class="space-y-6">
              <h2 use:revealWords class="reveal-words text-brand-grey-500 text-4xl  font-medium leading-[95%]">
                Introduction
              </h2>
              <p use:reveal class="reveal text-brand-grey-400 text-lg  leading-[160%]">
                Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
                <br /><br />
                Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
              </p>
            </section>

            <!-- {/* Image with Caption */} -->
            <div use:reveal class="reveal space-y-4">
              <img 
                src="/images/Image.png" 
                alt="Content" 
                class="w-full h-[480px] object-cover rounded-[40px]"
              />
              <p class="text-brand-grey-500 text-4xl  font-medium leading-[95%]">
                Image courtesy of Mathilde Langevin via Unsplash
              </p>
            </div>

            <!-- {/* Blockquote */} -->
            <blockquote use:reveal class="reveal flex gap-5 my-12">
              <div class="w-0.5 bg-brand-blue-500 flex-shrink-0"></div>
              <div class="py-2 space-y-8">
                <p class="text-brand-grey-500 text-4xl  font-medium leading-[95%]">
                  "In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear."
                </p>
                <p class="text-brand-grey-500 text-4xl  font-medium leading-[95%]">
                  — Olivia Rhye, Product Designer
                </p>
              </div>
            </blockquote>

            <!-- {/* More Content */} -->
            <p use:reveal class="reveal text-brand-grey-400 text-lg  leading-[160%]">
              Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.
              <br /><br />
              Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.
              <br /><br />
              Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh orci.
            </p>

            <!-- {/* Software and tools */} -->
            <section class="space-y-4">
              <h2 use:revealWords class="reveal-words text-brand-grey-500 text-4xl  font-medium leading-[95%]">
                Software and tools
              </h2>
              <p use:reveal class="reveal text-brand-grey-400 text-lg  leading-[160%]">
                Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor. Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac pellentesque ac.
              </p>
            </section>

            <!-- {/* Other resources */} -->
            <section class="space-y-4">
              <h2 use:revealWords class="reveal-words text-brand-grey-500 text-4xl  font-medium leading-[95%]">
                Other resources
              </h2>
              <p use:reveal class="reveal text-brand-grey-400 text-lg  leading-[160%]">
                Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas sociis sit lorem nunc nunc sit. Eget diam curabitur mi ac. Auctor rutrum lacus malesuada massa ornare et. Vulputate consectetur ac ultrices at diam dui eget fringilla tincidunt. Arcu sit dignissim massa erat cursus vulputate gravida id. Sed quis auctor vulputate hac elementum gravida cursus dis.
                <br /><br />
                Lectus id duis vitae porttitor enim gravida morbi.<br />
                Eu turpis posuere semper feugiat volutpat elit, ultrices suspendisse. Auctor vel in vitae placerat.<br />
                Suspendisse maecenas ac donec scelerisque diam sed est duis purus.
              </p>
            </section>

            <!-- {/* Final Image */} -->
            <div use:reveal class="reveal space-y-4">
              <img 
                src="/images/Image1.png" 
                alt="Content" 
                class="w-full h-[480px] object-cover"
              />
              <p class="text-brand-grey-500 text-4xl  font-semibold leading-[95%]">
                Image courtesy of Michiel Annaert via Unsplash
              </p>
            </div>

            <!-- {/* Final Paragraph */} -->
            <p use:reveal class="reveal text-brand-grey-400 text-lg  leading-[160%]">
              Lectus leo massa amet posuere. Malesuada mattis non convallis quisque. Libero sit et imperdiet bibendum quisque dictum vestibulum in non. Pretium ultricies tempor non est diam. Enim ut enim amet amet integer cursus. Sit ac commodo pretium sed etiam turpis suspendisse at.
              <br /><br />
              Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit duis ultricies vulputate morbi feugiat cras placerat elit. Aliquam tellus lorem sed ac. Montes, sed mattis pellentesque suscipit accumsan. Cursus viverra aenean magna risus elementum faucibus molestie pellentesque. Arcu ultricies sed mauris vestibulum.
            </p>

            <!-- {/* Conclusion Box */} -->
            <div class="bg-gray-50 p-8 rounded-2xl space-y-6">
              <h2 use:revealWords class="reveal-words text-brand-grey-500 text-4xl  font-semibold leading-[95%]">
                Conclusion
              </h2>
              <p use:reveal class="reveal text-brand-grey-400 text-lg  leading-[160%]">
                Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est ultricies ultricies. Duis est sit sed leo nisl, blandit elit sagittis. Quisque tristique consequat quam sed. Nisl at scelerisque amet nulla purus habitasse.
                <br /><br />
                Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas condimentum mi massa. In tincidunt pharetra consectetur sed duis facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit dictum eget nibh tortor commodo cursus.
                <br /><br />
                Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec posuere pharetra odio consequat scelerisque et, nunc tortor.
                <br /><br />
                Nulla adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere cursus diam.
              </p>
            </div>
          </div>
        </div>
      </section>
    <Article showHeader={true} limit={3} />
    <Newsletter class="bg-bg-orange" />
    <ContactUs />
</main>


