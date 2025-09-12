<section class="next-section">
    <!-- {/* Testimonials Section */} -->
    <section class="bg-bg-blue px-4 py-16 md:px-16 md:py-24">
        <div class="mx-auto max-w-7xl">
            <div class="flex flex-col gap-12 lg:flex-row lg:gap-24">
                <!-- Label -->
                <div use:reveal class="reveal w-full flex-shrink-0 lg:w-96">
                    <p class="text-lg text-brand-grey-500">Testimonial</p>
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
                                class="min-h-[6rem] text-2xl  leading-[1.3] text-brand-grey-500 md:text-3xl"
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
                                class="h-12 w-12 rounded-full"
                            />
                            <div>
                                <h4 class=" font-bold text-brand-grey-500">
                                    {testimonials[current].name}
                                </h4>
                                <p class="text-sm text-brand-grey-500">
                                    {testimonials[current].role}
                                </p>
                            </div>
                        </div>

                        <!-- Navigation Buttons -->
                        <div class="flex items-center gap-3">
                            <button
                                class="flex h-10 w-10 items-center justify-center rounded-full border border-brand-blue-500"
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
                                class="flex h-10 w-10 items-center justify-center rounded-full border border-brand-blue-500 bg-brand-blue-50"
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