<script lang="ts">
	import { untrack } from 'svelte';
	import { browser } from '$app/env';
	import 'quill/dist/quill.snow.css';
	import { safeHTML } from '#lib/utils/safeHTML.ts';

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
	<div class="quill-view prose prose-slate max-w-none" use:safeHTML={value}>
		{@html value ?? ''}
	</div>
{:else if browser}
	<div bind:this={editorContainer} class="quill-editor"></div>
{/if}

<style>
	.quill-editor {
		min-height: 300px;
	}
</style>
