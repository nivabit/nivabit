<script lang="ts">
	import { untrack } from 'svelte';
	import { browser } from '$app/env';
	import 'quill/dist/quill.snow.css';

	type Props = {
		value?: string | null;
		readOnly?: boolean;
	};

	let { value = $bindable(), readOnly = false }: Props = $props();

	let editorContainer = $state<HTMLDivElement | undefined>(undefined);
	let quill: any;

	const toolbar = [
		[{ font: [] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ color: [] }, { background: [] }],
		[{ script: 'sub' }, { script: 'super' }],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ indent: '-1' }, { indent: '+1' }],
		[{ direction: 'rtl' }],
		[{ align: [] }],
		['blockquote', 'code-block'],
		['link', 'image', 'video'],
		['clean']
	];

	function onTextChange() {
		if (quill) {
			value = quill.root.innerHTML;
		}
	}

	$effect(() => {
		if (!browser || readOnly || !editorContainer) return;

		const container = editorContainer;
		const initialValue = untrack(() => value);
		let cancelled = false;
		let quillInstance: any;

		(async () => {
			const Quill = (await import('quill')).default;
			if (cancelled) return;

			quillInstance = new Quill(container, {
				theme: 'snow',
				modules: { toolbar },
				placeholder: 'Write your article content here...'
			});

			if (initialValue) {
				quillInstance.clipboard.dangerouslyPasteHTML(initialValue, 'silent');
			}

			quillInstance.on('text-change', onTextChange);
			quill = quillInstance;
		})();

		return () => {
			cancelled = true;
			quillInstance?.off('text-change', onTextChange);
			quill = undefined;
		};
	});
</script>

{#if readOnly}
	<!-- Safe HTML display (SSR + client) -->
	<div class="quill-view max-w-none">
		{@html value ?? ''}
	</div>
{:else if browser}
	<div bind:this={editorContainer} class="quill-editor"></div>
{/if}

<style>
	.quill-editor {
		min-height: 300px;
	}

	.quill-view {
		color: #1e293b;
		font-size: 1rem;
		line-height: 1.7;
	}

	.quill-view :global(p) {
		margin-bottom: 0.85rem;
	}

	.quill-view :global(p:last-child) {
		margin-bottom: 0;
	}

	/* Collapse Quill's empty spacer paragraphs (<p><br></p>) so Enter/lists don't create giant gaps */
	.quill-view :global(p:empty),
	.quill-view :global(p:has(> br:only-child)) {
		display: none;
	}

	.quill-view :global(h1),
	.quill-view :global(h2),
	.quill-view :global(h3),
	.quill-view :global(h4) {
		color: #090d14;
		font-weight: 800;
		line-height: 1.25;
		letter-spacing: -0.02em;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.quill-view :global(h1) {
		font-size: 1.875rem;
	}

	.quill-view :global(h2) {
		font-size: 1.5rem;
	}

	.quill-view :global(h3) {
		font-size: 1.25rem;
	}

	.quill-view :global(h4) {
		font-size: 1.125rem;
	}

	/* Standard HTML lists & Quill v1/v2 lists */
	.quill-view :global(ul),
	.quill-view :global(ol) {
		margin-top: 0.4rem;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.quill-view :global(ul) {
		list-style-type: disc;
	}

	.quill-view :global(ol) {
		list-style-type: decimal;
	}

	.quill-view :global(li) {
		margin-bottom: 0.3rem;
		padding-left: 0.25rem;
	}

	.quill-view :global(li::marker) {
		color: #2563eb;
		font-weight: 700;
	}

	/* Quill v2 outputs bullet lists as <ol><li data-list="bullet"> */
	.quill-view :global(li[data-list='bullet']) {
		list-style-type: disc;
	}

	.quill-view :global(li[data-list='ordered']) {
		list-style-type: decimal;
	}

	.quill-view :global(li .ql-ui) {
		display: none;
	}

	.quill-view :global(.ql-indent-1) {
		margin-left: 1.5rem;
	}

	.quill-view :global(.ql-indent-2) {
		margin-left: 3rem;
	}

	.quill-view :global(.ql-indent-3) {
		margin-left: 4.5rem;
	}

	.quill-view :global(.ql-indent-4) {
		margin-left: 6rem;
	}

	.quill-view :global(a) {
		color: #2563eb !important;
		font-weight: 600;
		text-decoration: underline !important;
		text-decoration-color: rgba(37, 99, 235, 0.45);
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
		transition: color 0.15s ease, text-decoration-color 0.15s ease;
	}

	.quill-view :global(a *) {
		color: inherit !important;
		text-decoration: inherit !important;
	}

	.quill-view :global(a:hover) {
		color: #1d4ed8 !important;
		text-decoration-color: #1d4ed8;
	}

	.quill-view :global(strong) {
		color: #090d14;
		font-weight: 700;
	}

	.quill-view :global(blockquote) {
		margin: 1.5rem 0;
		border-left: 3px solid #2563eb;
		background: #f8fafc;
		padding: 0.85rem 1.25rem;
		border-radius: 0 0.75rem 0.75rem 0;
		color: #334155;
		font-style: italic;
	}

	.quill-view :global(pre),
	.quill-view :global(.ql-code-block-container) {
		margin: 1.25rem 0;
		overflow-x: auto;
		border-radius: 0.75rem;
		background: #090d14;
		padding: 1rem 1.25rem;
		color: #e2e8f0;
		font-size: 0.875rem;
	}

	.quill-view :global(img) {
		margin: 1.5rem auto;
		max-width: 100%;
		border-radius: 1rem;
	}

	.quill-view :global(.ql-align-center) {
		text-align: center;
	}

	.quill-view :global(.ql-align-right) {
		text-align: right;
	}

	.quill-view :global(.ql-align-justify) {
		text-align: justify;
	}
</style>
