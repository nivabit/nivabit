
export function safeHTML(node: HTMLElement, html: string | null | undefined) {
	if (html) node.innerHTML = html;
	return {
		update(newHtml: string | null) {
			if (newHtml !== html) {
				node.innerHTML = newHtml ?? '';
			}
		}
	};
}
