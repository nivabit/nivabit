export function reveal(node: HTMLElement, options?: { threshold?: number; rootMargin?: string }) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('reveal-visible');
					observer.unobserve(node); // animate once
				}
			}
		},
		{
			threshold: options?.threshold ?? 0.1,
			rootMargin: options?.rootMargin ?? '0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
}
