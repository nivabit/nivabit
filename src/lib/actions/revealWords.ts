
// src/lib/actions/revealWords.ts
export function revealWords(node: HTMLElement, { once = true } = {}) {
	const text = node.textContent ?? "";
	if (!text.trim()) return;

	// Clear the original text
	node.textContent = "";

	// Split into spans
	const words = text.split(" ");
	words.forEach((word, i) => {
		const span = document.createElement("span");
		span.textContent = word;
        span.style.marginRight = "0.22em";
		span.style.opacity = "0";
		span.style.display = "inline-block";
		span.style.transform = "translateY(20px)";
		span.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
		node.appendChild(span);
	});

	const reveal = () => {
		const spans = node.querySelectorAll("span");
		spans.forEach((span) => {
			(span as HTMLElement).style.opacity = "1";
			(span as HTMLElement).style.transform = "translateY(0)";
		});
	};

	// Observe when in view
	const observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				reveal();
				if (once) observer.unobserve(node);
			}
		}
	}, { threshold: 0.1 });

	observer.observe(node);

	// 🔑 Fix for hero section already in view on load
	if (typeof window !== "undefined") {
		requestAnimationFrame(() => {
			const rect = node.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				reveal();
				if (once) observer.unobserve(node);
			}
		});
	}

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
