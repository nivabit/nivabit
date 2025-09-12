<script lang="ts">
	// No JS logic needed for this component
</script>

<!-- <div class="relative flex h-48 w-48 items-center justify-center"> -->
	<!-- Outer circle with opacity -->
	<!-- <div class="absolute h-48 w-48 rounded-full bg-white opacity-15"></div> -->

	<!-- Inner circle -->
	<!-- <div
		class="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-bg-orange"
	></div> -->

	<!-- Rotating text -->
	<!-- <div class="absolute h-40 w-40 animate-spin" style="animation-duration: 20s;">
		<svg width="160" height="160" viewBox="0 0 160 160" class="h-full w-full">
			<defs>
				<path id="circle" d="M 80,80 m -65,0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0" />
			</defs>
			<text
				class="font-lato fill-white text-base font-normal"
				style="word-spacing: 10px; letter-spacing: 29px;"
				textLength="408"
				lengthAdjust="spacing"
			>
				<textPath href="#circle" startOffset="-2%">
					Ready to Transform Your Business <tspan font-size="34" dx="4" class="fill-orange-500"
						>★</tspan
					>
				</textPath>
			</text>
		</svg>
	</div> -->

	<!-- Center icons -->
	<!-- <div
		class="absolute inset-0 flex animate-spin items-center justify-center"
		style="animation-duration: 20s;"
	>
		<div class="relative flex items-center justify-center"> -->
			<!-- Arrow icon -->
			<!-- <svg class="h-8 w-8" viewBox="0 0 34 34" fill="none">
				<path
					d="M7.2793 24.5748L21.8295 10.0246H12.7751V7.27664H26.5148V21.0163H23.7668V11.9618L9.21658 26.5121L7.2793 24.5748Z"
					fill="#212121"
					fill-opacity="0.8"
				/>
			</svg>
		</div>
	</div>
</div> -->


<div class="rotating-wrapper">
	<img src="/icons/Rotate.svg" alt="Circular Text" class="rotating-svg" />
</div>

<style>
	.rotating-wrapper {
	width: 12rem;   /* same as h-48 w-48 */
	height: 12rem;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.rotating-svg {
	width: 100%;
	height: 100%;
	animation: rotate 20s linear infinite;
	transform-origin: center;
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

</style>